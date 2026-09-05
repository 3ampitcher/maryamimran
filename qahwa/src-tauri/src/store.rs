//! Everything Qahwa remembers, in one small JSON file in the app config
//! directory. No database, no server, nothing that leaves the machine.

use std::{
    fs,
    io,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicBool, Ordering},
        Mutex,
    },
};

use serde::{Deserialize, Serialize};

use crate::recipes::{self, BUILT_INS};

/// Bumped only when the shape of the file changes. Adding a built-in recipe
/// does not need a bump — `absorb_new_built_ins` handles that on every load.
pub const DATA_VERSION: u32 = 2;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Recipe {
    pub id: String,
    pub name: String,
    pub purpose: String,
    pub explanation: String,
    pub prompt: String,
    pub icon: String,
    pub accent: String,
    pub enabled: bool,
    pub order: i32,
    /// The built-in this began life as. `None` means the user created it, and
    /// only those can be deleted.
    #[serde(default)]
    pub origin: Option<String>,
}

impl Recipe {
    pub fn file_name(&self) -> String {
        recipes::file_name(&self.icon, &self.name, &self.purpose)
    }

    /// A built-in the user has since edited — the only case where offering
    /// "reset to original" means anything.
    fn is_modified_built_in(&self) -> bool {
        match self.origin.as_deref().and_then(recipes::built_in) {
            Some(b) => {
                self.name != b.name
                    || self.purpose != b.purpose
                    || self.explanation != b.explanation
                    || self.prompt != b.prompt
                    || self.icon != b.icon
                    || self.accent != b.accent
            }
            None => false,
        }
    }

    /// Presets are a closed set, so a hand-edited or imported file cannot smuggle
    /// an unknown icon or colour into the UI.
    pub fn sanitize(&mut self) {
        if !recipes::is_known_icon(&self.icon) {
            self.icon = "espresso".into();
        }
        if !recipes::is_known_accent(&self.accent) {
            self.accent = "espresso".into();
        }
        self.name = self.name.trim().chars().take(60).collect();
        self.purpose = self.purpose.trim().chars().take(60).collect();
        self.explanation = self.explanation.trim().chars().take(240).collect();
        if self.name.is_empty() {
            self.name = "Coffee".into();
        }
    }
}

/// What the UI is allowed to see in a list: everything except the prompt, which
/// only the editor asks for.
#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RecipeView {
    pub id: String,
    pub name: String,
    pub purpose: String,
    pub explanation: String,
    pub icon: String,
    pub accent: String,
    pub enabled: bool,
    pub order: i32,
    pub builtin: bool,
    pub modified: bool,
    pub file_name: String,
}

impl From<&Recipe> for RecipeView {
    fn from(r: &Recipe) -> Self {
        Self {
            id: r.id.clone(),
            name: r.name.clone(),
            purpose: r.purpose.clone(),
            explanation: r.explanation.clone(),
            icon: r.icon.clone(),
            accent: r.accent.clone(),
            enabled: r.enabled,
            order: r.order,
            builtin: r.origin.is_some(),
            modified: r.is_modified_built_in(),
            file_name: r.file_name(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub always_on_top: bool,
    pub show_tray: bool,
    pub launch_at_login: bool,
    pub selected_recipe: Option<String>,
    pub seen_intro: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            // V0.2 deliberately behaves like an ordinary window until asked not to.
            always_on_top: false,
            show_tray: true,
            launch_at_login: false,
            selected_recipe: None,
            seen_intro: false,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Geometry {
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct Data {
    pub version: u32,
    pub settings: Settings,
    pub window: Option<Geometry>,
    pub recipes: Vec<Recipe>,
}

fn built_in_to_recipe(b: &recipes::BuiltIn, order: i32) -> Recipe {
    Recipe {
        id: b.id.to_string(),
        name: b.name.to_string(),
        purpose: b.purpose.to_string(),
        explanation: b.explanation.to_string(),
        prompt: b.prompt.to_string(),
        icon: b.icon.to_string(),
        accent: b.accent.to_string(),
        enabled: true,
        order,
        origin: Some(b.id.to_string()),
    }
}

impl Data {
    fn fresh() -> Self {
        Self {
            version: DATA_VERSION,
            settings: Settings::default(),
            window: None,
            recipes: BUILT_INS
                .iter()
                .enumerate()
                .map(|(i, b)| built_in_to_recipe(b, i as i32))
                .collect(),
        }
    }

    /// Adds built-ins the stored file has never seen, and leaves every recipe
    /// already in it exactly as the user left it — edited, reordered, hidden or
    /// otherwise. This is what makes upgrading safe.
    fn absorb_new_built_ins(&mut self) {
        let mut next = self.recipes.iter().map(|r| r.order).max().unwrap_or(-1) + 1;
        for b in BUILT_INS {
            if !self.recipes.iter().any(|r| r.id == b.id) {
                self.recipes.push(built_in_to_recipe(b, next));
                next += 1;
            }
        }
        for r in &mut self.recipes {
            r.sanitize();
        }
        self.version = DATA_VERSION;
    }
}

pub struct Store {
    path: PathBuf,
    data: Mutex<Data>,
    /// Set by `touch`. Dragging a window fires a move event per frame, and none
    /// of those are worth a disk write on their own.
    dirty: AtomicBool,
}

impl Store {
    /// Reads the file if it is there. A missing or corrupt file is not an error
    /// worth stopping for — the app starts on the built-in menu instead, and the
    /// damaged file is kept alongside so nothing is silently destroyed.
    pub fn load(dir: &Path) -> Self {
        let path = dir.join("qahwa.json");
        let mut data = match fs::read_to_string(&path) {
            Ok(text) => match serde_json::from_str::<Data>(&text) {
                Ok(d) => d,
                Err(e) => {
                    eprintln!("qahwa: could not parse {}: {e}", path.display());
                    let _ = fs::rename(&path, path.with_extension("json.broken"));
                    Data::fresh()
                }
            },
            Err(_) => Data::fresh(),
        };
        data.absorb_new_built_ins();

        let store = Self { path, data: Mutex::new(data), dirty: AtomicBool::new(false) };
        store.save();
        store
    }

    pub fn with<T>(&self, f: impl FnOnce(&Data) -> T) -> T {
        f(&self.data.lock().expect("store lock"))
    }

    /// Mutates and persists in one step, so no caller can change state and
    /// forget to write it out.
    pub fn update<T>(&self, f: impl FnOnce(&mut Data) -> T) -> T {
        let out = {
            let mut data = self.data.lock().expect("store lock");
            f(&mut data)
        };
        // A full write covers anything `touch` was holding back too.
        self.dirty.store(false, Ordering::Relaxed);
        self.save();
        out
    }

    /// Records a change without writing it out. For state that changes many
    /// times a second — a window being dragged — paired with `flush`.
    pub fn touch<T>(&self, f: impl FnOnce(&mut Data) -> T) -> T {
        let out = {
            let mut data = self.data.lock().expect("store lock");
            f(&mut data)
        };
        self.dirty.store(true, Ordering::Relaxed);
        out
    }

    /// Writes out anything `touch` recorded. Cheap and safe to call on a timer.
    pub fn flush(&self) {
        if self.dirty.swap(false, Ordering::Relaxed) {
            self.save();
        }
    }

    /// Writes via a temporary file and a rename, so a crash mid-write leaves the
    /// previous settings intact rather than a half-written file.
    fn save(&self) {
        let data = self.data.lock().expect("store lock").clone();
        if let Err(e) = self.write(&data) {
            eprintln!("qahwa: could not save {}: {e}", self.path.display());
        }
    }

    fn write(&self, data: &Data) -> io::Result<()> {
        if let Some(parent) = self.path.parent() {
            fs::create_dir_all(parent)?;
        }
        let tmp = self.path.with_extension("json.tmp");
        fs::write(&tmp, serde_json::to_string_pretty(data)?)?;
        fs::rename(&tmp, &self.path)
    }

    pub fn path(&self) -> &Path {
        &self.path
    }
}

/// Recipes in display order. `enabled_only` is what the carousel shows; the
/// library shows everything.
pub fn ordered(data: &Data, enabled_only: bool) -> Vec<&Recipe> {
    let mut list: Vec<&Recipe> = data
        .recipes
        .iter()
        .filter(|r| !enabled_only || r.enabled)
        .collect();
    list.sort_by_key(|r| (r.order, r.id.clone()));
    list
}

/// Ids are generated here rather than in the UI so an imported file can never
/// collide with something already stored.
pub fn new_id() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    format!("custom.{nanos:x}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_fresh_store_is_the_built_in_menu() {
        let d = Data::fresh();
        assert_eq!(d.recipes.len(), BUILT_INS.len());
        assert!(d.recipes.iter().all(|r| r.enabled && r.origin.is_some()));
        assert!(!d.settings.always_on_top, "V0.2 must not float by default");
    }

    #[test]
    fn upgrading_adds_new_built_ins_without_touching_edits() {
        let mut d = Data::fresh();
        // Someone edits one built-in, hides another, and loses a third entirely
        // (as would happen if it did not exist in the version they installed).
        d.recipes[0].prompt = "my own words".into();
        d.recipes[0].name = "Ristretto".into();
        d.recipes[1].enabled = false;
        let dropped = d.recipes.remove(2).id;

        d.absorb_new_built_ins();

        let edited = d.recipes.iter().find(|r| r.id == BUILT_INS[0].id).unwrap();
        assert_eq!(edited.prompt, "my own words", "an edit was overwritten");
        assert_eq!(edited.name, "Ristretto");
        assert!(!d.recipes.iter().find(|r| r.id == BUILT_INS[1].id).unwrap().enabled);
        assert!(d.recipes.iter().any(|r| r.id == dropped), "new built-in was not added");
        assert_eq!(d.recipes.len(), BUILT_INS.len());
    }

    #[test]
    fn a_hidden_built_in_does_not_come_back_on_upgrade() {
        let mut d = Data::fresh();
        d.recipes[3].enabled = false;
        d.absorb_new_built_ins();
        assert_eq!(d.recipes.iter().filter(|r| r.id == BUILT_INS[3].id).count(), 1);
        assert!(!d.recipes[3].enabled);
    }

    #[test]
    fn unknown_presets_are_replaced_rather_than_rendered() {
        let mut r = built_in_to_recipe(&BUILT_INS[0], 0);
        r.icon = "https://example.com/evil.svg".into();
        r.accent = "url(javascript:alert(1))".into();
        r.sanitize();
        assert_eq!(r.icon, "espresso");
        assert_eq!(r.accent, "espresso");
    }

    #[test]
    fn an_edited_built_in_reports_itself_as_modified() {
        let mut r = built_in_to_recipe(&BUILT_INS[0], 0);
        assert!(!r.is_modified_built_in());
        r.prompt.push_str(" and one more thing");
        assert!(r.is_modified_built_in());
    }

    #[test]
    fn ordering_respects_order_then_hides_disabled() {
        let mut d = Data::fresh();
        d.recipes[0].order = 99;
        d.recipes[1].enabled = false;
        let all = ordered(&d, false);
        assert_eq!(all.last().unwrap().id, BUILT_INS[0].id);
        assert_eq!(ordered(&d, true).len(), BUILT_INS.len() - 1);
    }
}
