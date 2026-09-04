//! Qahwa — a tiny coffee machine that lives in the corner of the desktop.
//!
//! The whole point of the app is one gesture: drag the cup out of this window
//! and into another application. That is a *native* drag, not an HTML5 one —
//! on Windows it is an OLE `DoDragDrop` carrying a `CF_HDROP` payload, which is
//! the same thing Explorer sends when you drag a file out of a folder. A browser
//! receiving it cannot tell the difference between that and a real file, which
//! is exactly what makes the drop land in ChatGPT as an ordinary upload.

mod shot;

use std::{sync::mpsc, thread};

use serde::Serialize;
use tauri::{AppHandle, Manager, PhysicalPosition, Runtime, WebviewWindow};

/// The bitmap that rides under the cursor during the drag. This is how the cup
/// "follows the cursor" across application boundaries — no web view can do that,
/// because the cursor has already left the window.
const CUP_IMAGE: &[u8] = include_bytes!("../assets/cup-drag.png");

/// Gap between the window and the corner of the work area, in logical pixels.
const CORNER_MARGIN: f64 = 24.0;

#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum PourOutcome {
    /// The cup landed in another application.
    Dropped,
    /// The user let go over nothing, or pressed Escape.
    Cancelled,
}

/// Writes a fresh Reality Shot and hands it to the operating system as a native
/// drag. Resolves once the drag finishes, so the UI knows when to put the cup
/// back on its tray.
#[tauri::command]
async fn pour_reality_shot<R: Runtime>(
    app: AppHandle<R>,
    window: WebviewWindow<R>,
) -> Result<PourOutcome, String> {
    let path = shot::pour().map_err(|e| format!("could not brew the shot: {e}"))?;

    // `drag::start_drag` must run on the main thread, and on Windows it blocks
    // there for the entire drag. So: hand the work to the main thread, then wait
    // here for the outcome to come back.
    let (tx, rx) = mpsc::channel::<Result<PourOutcome, String>>();
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
                        // the shot sit on disk for a while before clearing it.
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
        // here instead — and clean up the shot nobody is going to receive.
        if let Err(e) = started {
            shot::discard(&path);
            let _ = tx.send(Err(format!("the drag would not start: {e}")));
        }
    })
    .map_err(|e| format!("could not reach the main thread: {e}"))?;

    rx.recv()
        .map_err(|_| "the drag ended without reporting a result".to_string())?
}

/// Parks the window in the bottom-right of the work area — above the taskbar,
/// not under it.
fn settle_in_corner<R: Runtime>(window: &WebviewWindow<R>) -> tauri::Result<()> {
    let monitor = match window.current_monitor()? {
        Some(m) => Some(m),
        None => window.primary_monitor()?,
    };
    let Some(monitor) = monitor else { return Ok(()) };

    let area = monitor.work_area();
    let size = window.outer_size()?;
    let margin = (CORNER_MARGIN * monitor.scale_factor()).round() as i32;

    window.set_position(PhysicalPosition::new(
        area.position.x + area.size.width as i32 - size.width as i32 - margin,
        area.position.y + area.size.height as i32 - size.height as i32 - margin,
    ))
}

pub fn run() {
    // Anything left behind by a previous run (a crash mid-drag, a hard kill).
    shot::sweep(shot::LINGER);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![pour_reality_shot])
        .setup(|app| {
            let window = app
                .get_webview_window("main")
                .expect("the main window is declared in tauri.conf.json");
            // The window starts hidden so it is never painted in the wrong
            // corner first and then jumps.
            let _ = settle_in_corner(&window);
            window.show()?;
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building Qahwa")
        .run(|_app, event| {
            if let tauri::RunEvent::Exit = event {
                shot::sweep(shot::LINGER);
            }
        });
}
