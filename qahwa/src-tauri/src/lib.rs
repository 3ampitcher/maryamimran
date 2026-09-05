//! Qahwa — a small coffee machine for the desktop.
//!
//! Each coffee is a prompt. The user picks one and drags its cup into an AI
//! chat, where it arrives as an ordinary uploaded Markdown file.
//!
//! The load-bearing part is that drag. It is a *native* one, not an HTML5 drag:
//! on Windows an OLE `DoDragDrop` carrying a `CF_HDROP` payload, which is the
//! same thing Explorer sends when you drag a file out of a folder. A browser
//! receiving it cannot tell the difference between that and a real file on
//! disk. `pour` below is unchanged from V0.1 apart from taking a recipe.

mod geometry;
mod recipes;
mod shot;
mod store;
mod window;

use std::{sync::mpsc, thread, time::Duration};

use serde::{Deserialize, Serialize};
use tauri::{
    menu::{CheckMenuItem, Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager, State, WebviewWindow, Wry,
};

use store::{Data, Recipe, RecipeView, Settings, Store};

/// The bitmap that rides under the cursor during the drag. This is how the cup
/// "follows the cursor" across application boundaries — no web view can do
/// that, because the cursor has already left the window.
const CUP_IMAGE: &[u8] = include_bytes!("../assets/cup-drag.png");

/// How often window moves and resizes are written to disk.
const GEOMETRY_FLUSH: Duration = Duration::from_secs(2);

const TRAY_ID: &str = "qahwa";

type Result<T> = std::result::Result<T, String>;

fn err(context: &str, e: impl std::fmt::Display) -> String {
    format!("{context}: {e}")
}

// ---------------------------------------------------------------- the drag

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum PourOutcome {
    /// The cup landed in another application.
    Dropped,
    /// The user let go over nothing, or pressed Escape.
    Cancelled,
}

/// Writes the selected recipe to a temporary file and hands it to the operating
/// system as a native drag. Resolves once the drag finishes, so the UI knows
/// when to put the cup back on its tray.
#[tauri::command]
async fn pour(
    app: AppHandle,
    window: WebviewWindow<Wry>,
    store: State<'_, Store>,
    recipe_id: String,
) -> Result<PourOutcome> {
    let recipe = store
        .with(|d| d.recipes.iter().find(|r| r.id == recipe_id).cloned())
        .ok_or_else(|| format!("no recipe called {recipe_id}"))?;

    let path = shot::pour(&recipe.file_name(), &recipe.prompt)
        .map_err(|e| err("could not brew the coffee", e))?;

    // `drag::start_drag` must run on the main thread, and on Windows it blocks
    // there for the entire drag. So: hand the work to the main thread, then wait
    // here for the outcome to come back.
    let (tx, rx) = mpsc::channel::<Result<PourOutcome>>();
    let callback_tx = tx.clone();
    let drag_path = path.clone();
    let cleanup_path = path.clone();

    app.run_on_main_thread(move || {
        #[cfg(target_os = "linux")]
        let handle = match window.gtk_window() {
            Ok(w) => w,
            Err(e) => {
                shot::discard(&path);
                let _ = tx.send(Err(e.to_string()));
                return;
            }
        };
        #[cfg(not(target_os = "linux"))]
        let handle = window.clone();

        let started = drag::start_drag(
            &handle,
            drag::DragItem::Files(vec![drag_path]),
            drag::Image::Raw(CUP_IMAGE.to_vec()),
            move |result, _cursor| {
                let outcome = match result {
                    drag::DragResult::Dropped => {
                        // A drop hands over a *path*, not bytes. The receiving
                        // app opens the file when its upload actually runs,
                        // which is a beat after the cursor is released — so let
                        // the file sit on disk for a while before clearing it.
                        let path = cleanup_path.clone();
                        thread::spawn(move || {
                            thread::sleep(shot::LINGER);
                            shot::discard(&path);
                        });
                        PourOutcome::Dropped
                    }
                    drag::DragResult::Cancel => {
                        shot::discard(&cleanup_path);
                        PourOutcome::Cancelled
                    }
                };
                let _ = callback_tx.send(Ok(outcome));
            },
            drag::Options::default(),
        );

        // The callback never fires if the drag could not start, so report that
        // here instead — and clean up the file nobody is going to receive.
        if let Err(e) = started {
            shot::discard(&path);
            let _ = tx.send(Err(err("the drag would not start", e)));
        }
    })
    .map_err(|e| err("could not reach the main thread", e))?;

    rx.recv()
        .map_err(|_| "the drag ended without reporting a result".to_string())?
}

// ------------------------------------------------------------- the recipes

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Preset {
    id: String,
    label: String,
    value: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RecipeInput {
    id: Option<String>,
    name: String,
    purpose: String,
    explanation: String,
    prompt: String,
    icon: String,
    accent: String,
}

#[tauri::command]
fn list_recipes(store: State<'_, Store>, enabled_only: bool) -> Vec<RecipeView> {
    store.with(|d| store::ordered(d, enabled_only).into_iter().map(Into::into).collect())
}

/// The only way to reach a prompt body. The carousel never asks for one, which
/// is what keeps the full text out of the main screen.
#[tauri::command]
fn get_recipe(store: State<'_, Store>, id: String) -> Result<Recipe> {
    store
        .with(|d| d.recipes.iter().find(|r| r.id == id).cloned())
        .ok_or_else(|| format!("no recipe called {id}"))
}

#[tauri::command]
fn save_recipe(store: State<'_, Store>, input: RecipeInput) -> Result<RecipeView> {
    store.update(|d| {
        match input.id.as_ref().and_then(|id| d.recipes.iter_mut().find(|r| &r.id == id)) {
            Some(existing) => {
                existing.name = input.name;
                existing.purpose = input.purpose;
                existing.explanation = input.explanation;
                existing.prompt = input.prompt;
                existing.icon = input.icon;
                existing.accent = input.accent;
                existing.sanitize();
                Ok(RecipeView::from(&*existing))
            }
            None => {
                let order = d.recipes.iter().map(|r| r.order).max().unwrap_or(-1) + 1;
                let mut fresh = Recipe {
                    id: store::new_id(),
                    name: input.name,
                    purpose: input.purpose,
                    explanation: input.explanation,
                    prompt: input.prompt,
                    icon: input.icon,
                    accent: input.accent,
                    enabled: true,
                    order,
                    origin: None,
                };
                fresh.sanitize();
                let view = RecipeView::from(&fresh);
                d.recipes.push(fresh);
                Ok(view)
            }
        }
    })
}

#[tauri::command]
fn duplicate_recipe(store: State<'_, Store>, id: String) -> Result<RecipeView> {
    store.update(|d| {
        let source = d
            .recipes
            .iter()
            .find(|r| r.id == id)
            .cloned()
            .ok_or_else(|| format!("no recipe called {id}"))?;
        let order = d.recipes.iter().map(|r| r.order).max().unwrap_or(-1) + 1;
        // A copy is always the user's own, even when copied from a built-in —
        // otherwise "reset" and "delete" would disagree about what it is.
        let copy = Recipe {
            id: store::new_id(),
            purpose: format!("{} copy", source.purpose).trim().to_string(),
            order,
            origin: None,
            ..source
        };
        let view = RecipeView::from(&copy);
        d.recipes.push(copy);
        Ok(view)
    })
}

#[tauri::command]
fn delete_recipe(store: State<'_, Store>, id: String) -> Result<()> {
    store.update(|d| {
        let Some(pos) = d.recipes.iter().position(|r| r.id == id) else {
            return Err(format!("no recipe called {id}"));
        };
        if d.recipes[pos].origin.is_some() {
            return Err("built-in coffees can be hidden, but not deleted".into());
        }
        d.recipes.remove(pos);
        Ok(())
    })
}

#[tauri::command]
fn reset_recipe(store: State<'_, Store>, id: String) -> Result<RecipeView> {
    store.update(|d| {
        let recipe = d
            .recipes
            .iter_mut()
            .find(|r| r.id == id)
            .ok_or_else(|| format!("no recipe called {id}"))?;
        let original = recipe
            .origin
            .as_deref()
            .and_then(recipes::built_in)
            .ok_or_else(|| "this coffee has no original to go back to".to_string())?;
        recipe.name = original.name.into();
        recipe.purpose = original.purpose.into();
        recipe.explanation = original.explanation.into();
        recipe.prompt = original.prompt.into();
        recipe.icon = original.icon.into();
        recipe.accent = original.accent.into();
        Ok(RecipeView::from(&*recipe))
    })
}

#[tauri::command]
fn set_recipe_enabled(store: State<'_, Store>, id: String, enabled: bool) -> Result<()> {
    store.update(|d| -> Result<()> {
        let recipe = d
            .recipes
            .iter_mut()
            .find(|r| r.id == id)
            .ok_or_else(|| format!("no recipe called {id}"))?;
        recipe.enabled = enabled;
        Ok(())
    })?;
    // Leaving nothing on the carousel would strand the user on an empty screen.
    let any = store.with(|d| d.recipes.iter().any(|r| r.enabled));
    if !any {
        store.update(|d| {
            if let Some(r) = d.recipes.iter_mut().find(|r| r.id == id) {
                r.enabled = true;
            }
        });
        return Err("at least one coffee has to stay on the menu".into());
    }
    Ok(())
}

#[tauri::command]
fn reorder_recipes(store: State<'_, Store>, ids: Vec<String>) {
    store.update(|d| {
        for (i, id) in ids.iter().enumerate() {
            if let Some(r) = d.recipes.iter_mut().find(|r| &r.id == id) {
                r.order = i as i32;
            }
        }
    });
}

#[tauri::command]
fn icon_presets() -> Vec<Preset> {
    recipes::ICONS
        .iter()
        .map(|i| Preset { id: i.id.into(), label: i.label.into(), value: i.emoji.into() })
        .collect()
}

#[tauri::command]
fn accent_presets() -> Vec<Preset> {
    recipes::ACCENTS
        .iter()
        .map(|(id, hex)| Preset {
            id: (*id).into(),
            label: (*id).into(),
            value: (*hex).into(),
        })
        .collect()
}

/// What a backup file looks like. Versioned so a future import can tell what it
/// is holding.
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Backup {
    app: String,
    version: u32,
    recipes: Vec<Recipe>,
}

#[tauri::command]
fn export_recipes(store: State<'_, Store>, path: String) -> Result<String> {
    let backup = store.with(|d| Backup {
        app: "qahwa".into(),
        version: store::DATA_VERSION,
        recipes: d.recipes.clone(),
    });
    // `to_string_pretty` leaves non-ASCII alone, so ☕ and 🧊 survive the trip.
    let json = serde_json::to_string_pretty(&backup).map_err(|e| err("could not package", e))?;
    std::fs::write(&path, json).map_err(|e| err("could not write the backup", e))?;
    Ok(path)
}

#[tauri::command]
fn import_recipes(store: State<'_, Store>, path: String) -> Result<usize> {
    let text = std::fs::read_to_string(&path).map_err(|e| err("could not read that file", e))?;
    let backup: Backup =
        serde_json::from_str(&text).map_err(|e| err("that is not a Qahwa backup", e))?;
    if backup.app != "qahwa" {
        return Err("that is not a Qahwa backup".into());
    }

    Ok(store.update(|d| {
        let mut count = 0;
        let mut next = d.recipes.iter().map(|r| r.order).max().unwrap_or(-1) + 1;
        for mut incoming in backup.recipes {
            incoming.sanitize();
            match d.recipes.iter_mut().find(|r| r.id == incoming.id) {
                // Same id: an earlier backup of this recipe. Replace it, but
                // keep where it sits on the carousel.
                Some(existing) => {
                    let order = existing.order;
                    *existing = incoming;
                    existing.order = order;
                }
                None => {
                    incoming.order = next;
                    next += 1;
                    d.recipes.push(incoming);
                }
            }
            count += 1;
        }
        count
    }))
}

// ------------------------------------------------------------- preferences

#[tauri::command]
fn get_settings(store: State<'_, Store>) -> Settings {
    store.with(|d| d.settings.clone())
}

#[tauri::command]
fn select_recipe(store: State<'_, Store>, id: String) {
    store.update(|d| d.settings.selected_recipe = Some(id));
}

#[tauri::command]
fn mark_intro_seen(store: State<'_, Store>) {
    store.update(|d| d.settings.seen_intro = true);
}

#[tauri::command]
fn set_always_on_top(app: AppHandle, store: State<'_, Store>, enabled: bool) -> Result<()> {
    if let Some(w) = app.get_webview_window("main") {
        w.set_always_on_top(enabled).map_err(|e| err("could not change the window", e))?;
    }
    store.update(|d| d.settings.always_on_top = enabled);
    sync_tray_check(&app, enabled);
    Ok(())
}

#[tauri::command]
fn set_show_tray(app: AppHandle, store: State<'_, Store>, enabled: bool) -> Result<()> {
    store.update(|d| d.settings.show_tray = enabled);
    if enabled {
        install_tray(&app).map_err(|e| err("could not add the tray icon", e))?;
    } else {
        let _ = app.remove_tray_by_id(TRAY_ID);
        // Without a tray there is no way back from a hidden window, so make
        // sure the window is on screen before the only route to it disappears.
        show_and_focus(&app);
    }
    Ok(())
}

#[tauri::command]
fn set_launch_at_login(app: AppHandle, store: State<'_, Store>, enabled: bool) -> Result<()> {
    use tauri_plugin_autostart::ManagerExt;
    let manager = app.autolaunch();
    let outcome = if enabled { manager.enable() } else { manager.disable() };
    outcome.map_err(|e| err("could not change the startup setting", e))?;
    store.update(|d| d.settings.launch_at_login = enabled);
    Ok(())
}

#[tauri::command]
fn reset_window_size(app: AppHandle, store: State<'_, Store>) -> Result<()> {
    let Some(w) = app.get_webview_window("main") else { return Ok(()) };
    w.set_size(tauri::LogicalSize::new(DEFAULT_WIDTH, DEFAULT_HEIGHT))
        .map_err(|e| err("could not resize", e))?;
    remember_geometry(&w, &store);
    Ok(())
}

#[tauri::command]
fn reset_window_position(app: AppHandle, store: State<'_, Store>) -> Result<()> {
    let Some(w) = app.get_webview_window("main") else { return Ok(()) };
    window::settle_in_corner(&w).map_err(|e| err("could not move the window", e))?;
    remember_geometry(&w, &store);
    Ok(())
}

/// The ✕ in the header. With a tray icon there is a way back, so hide; without
/// one, hiding would strand the app with no way to reach it, so quit instead.
#[tauri::command]
fn close_window(app: AppHandle, store: State<'_, Store>) {
    let tray_available = store.with(|d| d.settings.show_tray);
    match app.get_webview_window("main") {
        Some(w) if tray_available => {
            let _ = w.hide();
        }
        _ => {
            store.flush();
            app.exit(0);
        }
    }
}

#[tauri::command]
fn config_path(store: State<'_, Store>) -> String {
    store.path().display().to_string()
}

fn remember_geometry(w: &WebviewWindow<Wry>, store: &Store) {
    if let Some(g) = window::geometry_of(w) {
        store.update(|d| d.window = Some(g));
    }
}

// ------------------------------------------------------------------- tray

fn show_and_focus(app: &AppHandle) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
        let _ = w.unminimize();
        let _ = w.set_focus();
    }
}

/// Keeps the tray's tick box in step when the toggle is flipped in the UI.
fn sync_tray_check(app: &AppHandle, enabled: bool) {
    if let Some(item) = app.try_state::<TrayCheck>() {
        if let Some(check) = item.0.lock().expect("tray lock").as_ref() {
            let _ = check.set_checked(enabled);
        }
    }
}

struct TrayCheck(std::sync::Mutex<Option<CheckMenuItem<Wry>>>);

fn install_tray(app: &AppHandle) -> tauri::Result<()> {
    if app.tray_by_id(TRAY_ID).is_some() {
        return Ok(());
    }
    let on_top = app.state::<Store>().with(|d| d.settings.always_on_top);

    let show = MenuItem::with_id(app, "show", "Show Qahwa", true, None::<&str>)?;
    let hide = MenuItem::with_id(app, "hide", "Hide Qahwa", true, None::<&str>)?;
    let keep = CheckMenuItem::with_id(
        app,
        "keep",
        "Keep above other apps",
        true,
        on_top,
        None::<&str>,
    )?;
    let quit = MenuItem::with_id(app, "quit", "Exit", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let menu = Menu::with_items(app, &[&show, &hide, &keep, &separator, &quit])?;

    // The state itself is managed once at startup: `manage` does not replace an
    // existing value, so turning the tray off and on again has to write through
    // the handle rather than register a new one.
    *app.state::<TrayCheck>().0.lock().expect("tray lock") = Some(keep);

    TrayIconBuilder::with_id(TRAY_ID)
        .icon(app.default_window_icon().expect("bundled icon").clone())
        .tooltip("Qahwa")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => show_and_focus(app),
            "hide" => {
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.hide();
                }
            }
            "keep" => {
                let store = app.state::<Store>();
                let next = !store.with(|d| d.settings.always_on_top);
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.set_always_on_top(next);
                }
                store.update(|d| d.settings.always_on_top = next);
                sync_tray_check(app, next);
                // The window's own toggle has to catch up.
                let _ = app.emit_to("main", "qahwa://always-on-top", next);
            }
            "quit" => {
                app.state::<Store>().flush();
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            // Left click is the "I have lost the window" gesture.
            if let TrayIconEvent::Click { button: MouseButton::Left, .. } = event {
                show_and_focus(tray.app_handle());
            }
        })
        .build(app)?;
    Ok(())
}

// ------------------------------------------------------------------- setup

const DEFAULT_WIDTH: f64 = 280.0;
const DEFAULT_HEIGHT: f64 = 330.0;

pub fn run() {
    // Anything left behind by a previous run (a crash mid-drag, a hard kill).
    shot::sweep(shot::LINGER);

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .invoke_handler(tauri::generate_handler![
            pour,
            list_recipes,
            get_recipe,
            save_recipe,
            duplicate_recipe,
            delete_recipe,
            reset_recipe,
            set_recipe_enabled,
            reorder_recipes,
            icon_presets,
            accent_presets,
            export_recipes,
            import_recipes,
            get_settings,
            select_recipe,
            mark_intro_seen,
            set_always_on_top,
            set_show_tray,
            set_launch_at_login,
            reset_window_size,
            reset_window_position,
            close_window,
            config_path,
        ])
        .setup(|app| {
            let dir = app.path().app_config_dir()?;
            let store = Store::load(&dir);
            let Data { settings, window: saved, .. } = store.with(Clone::clone);
            app.manage(store);
            app.manage(TrayCheck(std::sync::Mutex::new(None)));

            let window = app
                .get_webview_window("main")
                .expect("the main window is declared in tauri.conf.json");

            // The window starts hidden so it is never painted in the wrong place
            // first and then jumps.
            let _ = window::place(&window, saved);
            let _ = window.set_always_on_top(settings.always_on_top);
            window.show()?;

            if settings.show_tray {
                install_tray(app.handle())?;
            }

            // Moving a window fires an event per frame; batch those into one
            // write every couple of seconds.
            let handle = app.handle().clone();
            thread::spawn(move || loop {
                thread::sleep(GEOMETRY_FLUSH);
                handle.state::<Store>().flush();
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            use tauri::WindowEvent::*;
            let app = window.app_handle();
            match event {
                Moved(_) | Resized(_) => {
                    if let Some(w) = app.get_webview_window("main") {
                        if let Some(g) = window::geometry_of(&w) {
                            app.state::<Store>().touch(|d| d.window = Some(g));
                        }
                    }
                }
                CloseRequested { .. } | Destroyed => app.state::<Store>().flush(),
                _ => {}
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building Qahwa")
        .run(|app, event| {
            if let tauri::RunEvent::Exit = event {
                app.state::<Store>().flush();
                shot::sweep(shot::LINGER);
            }
        });
}
