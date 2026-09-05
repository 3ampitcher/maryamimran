//! Everything Rebrew remembers, in one small JSON file in the app config
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

/// 2 was Qahwa's six-coffee menu. 3 is the Rebrew four.
pub const DATA_VERSION: u32 = 3;

const FILE_NAME: &str = "rebrew.json";
/// Where Qahwa kept the same data, so an existing install can be carried over
/// rather than silently starting from scratch under the new name.
const LEGACY_DIR: &str = "com.qahwa.desktop";
const LEGACY_FILE: &str = "qahwa.json";

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
    /// The built-in this began life as. In this release every recipe has one:
    /// the MVP has no custom coffees.
    #[serde(default)]
    pub origin: Option<String>,
}

impl Recipe {
    pub fn file_name(&self) -> String {
        recipes::file_name(&self.purpose, &self.name)
    }

    /// A built-in the user has since edited — the only case where offering
    /// "restore the Rebrew default" means anything.
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

    /// Presets are a closed set, so a hand-edited file cannot smuggle an
    /// unknown drink or colour into the UI.
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
            // Rebrew behaves like an ordinary window until asked not to.
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
    /// Coffees that used to be on the menu and no longer are. Kept rather than
    /// deleted so an upgrade never destroys something the user wrote, and so a
    /// future release could put one back.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub retired: Vec<Recipe>,
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
            retired: Vec::new(),
        }
    }

    /// Brings a stored file up to the current menu.
    ///
    /// Recipes still on the menu keep everything the user did to them — edited
    /// prompts, order, whether they are hidden. Coffees no longer on the menu
    /// move to `retired` rather than being thrown away. Coffees the file has
    /// never seen are added.
    fn migrate(&mut self) {
        let (keep, gone): (Vec<Recipe>, Vec<Recipe>) = std::mem::take(&mut self.recipes)
            .into_iter()
            .partition(|r| recipes::built_in(&r.id).is_some());
        self.recipes = keep;
        for r in gone {
            if !self.retired.iter().any(|x| x.id == r.id) {
                self.retired.push(r);
            }
        }

        // Add in menu order, so a file that has never seen a coffee gets it in
        // the place the product intends rather than at the end.
        for (i, b) in BUILT_INS.iter().enumerate() {
            if !self.recipes.iter().any(|r| r.id == b.id) {
                self.recipes.push(built_in_to_recipe(b, i as i32));
            }
        }

        for r in &mut self.recipes {
            r.sanitize();
            // Every recipe in this release is a built-in; a file written by an
            // older build could disagree.
            if r.origin.is_none() {
                r.origin = Some(r.id.clone());
            }
        }
        if !self.recipes.iter().any(|r| r.enabled) {
            for r in &mut self.recipes {
                r.enabled = true;
            }
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
    /// Reads the file if it is there, falling back to Qahwa's if this is the
    /// first run under the new name. A missing or corrupt file is not an error
    /// worth stopping for — the app starts on the built-in menu instead, and
    /// the damaged file is kept alongside so nothing is silently destroyed.
    pub fn load(dir: &Path) -> Self {
        let path = dir.join(FILE_NAME);
        let source = if path.exists() { Some(path.clone()) } else { legacy_path(dir) };

        let mut data = match source.as_ref().map(fs::read_to_string) {
            Some(Ok(text)) => match serde_json::from_str::<Data>(&text) {
                Ok(d) => d,
                Err(e) => {
                    let from = source.as_deref().unwrap_or(&path);
                    eprintln!("rebrew: could not parse {}: {e}", from.display());
                    let _ = fs::rename(from, from.with_extension("json.broken"));
                    Data::fresh()
                }
            },
            _ => Data::fresh(),
        };
        data.migrate();

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
            eprintln!("rebrew: could not save {}: {e}", self.path.display());
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

/// Qahwa's config file, if this machine has one. It sits in a sibling directory
/// named after the old bundle identifier.
fn legacy_path(dir: &Path) -> Option<PathBuf> {
    let old = dir.parent()?.join(LEGACY_DIR).join(LEGACY_FILE);
    old.exists().then_some(old)
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

#[cfg(test)]
mod tests {
    use super::*;

    fn qahwa_era_file() -> Data {
        // What a V0.2 install looked like: six coffees, three of which are gone.
        let mut d = Data { version: 2, ..Data::fresh() };
        d.recipes = vec![
            built_in_to_recipe(&BUILT_INS[0], 0), // espresso, survives
            built_in_to_recipe(&BUILT_INS[1], 1), // cappuccino, survives
            built_in_to_recipe(&BUILT_INS[3], 2), // americano, survives
            Recipe { id: "builtin.cortado".into(), ..built_in_to_recipe(&BUILT_INS[0], 3) },
            Recipe { id: "builtin.flat-white".into(), ..built_in_to_recipe(&BUILT_INS[0], 4) },
            Recipe { id: "builtin.cold-brew".into(), ..built_in_to_recipe(&BUILT_INS[0], 5) },
        ];
        d
    }

    #[test]
    fn a_fresh_store_is_the_four_coffees() {
        let d = Data::fresh();
        assert_eq!(d.recipes.len(), 4);
        assert_eq!(d.recipes[2].purpose, "Second Opinion");
        assert!(!d.settings.always_on_top, "Rebrew must not float by default");
    }

    #[test]
    fn upgrading_from_qahwa_keeps_edits_and_retires_the_rest() {
        let mut d = qahwa_era_file();
        d.recipes[0].prompt = "my own words".into();
        d.recipes[1].enabled = false;

        d.migrate();

        assert_eq!(d.version, DATA_VERSION);
        assert_eq!(d.recipes.len(), 4, "the menu is four coffees");
        let espresso = d.recipes.iter().find(|r| r.id == "builtin.espresso").unwrap();
        assert_eq!(espresso.prompt, "my own words", "an edit was overwritten");
        assert!(!d.recipes.iter().find(|r| r.id == "builtin.cappuccino").unwrap().enabled);
        assert!(d.recipes.iter().any(|r| r.id == "builtin.latte"), "Latte was not added");
    }

    #[test]
    fn retired_coffees_are_kept_rather_than_destroyed() {
        let mut d = qahwa_era_file();
        d.recipes[5].prompt = "something the user wrote".into();
        d.migrate();

        let retired: Vec<_> = d.retired.iter().map(|r| r.id.as_str()).collect();
        assert!(retired.contains(&"builtin.cortado"));
        assert!(retired.contains(&"builtin.flat-white"));
        let brew = d.retired.iter().find(|r| r.id == "builtin.cold-brew").unwrap();
        assert_eq!(brew.prompt, "something the user wrote");
        assert!(!d.recipes.iter().any(|r| r.id == "builtin.cold-brew"), "still on the menu");
    }

    #[test]
    fn migrating_twice_does_not_duplicate_anything() {
        let mut d = qahwa_era_file();
        d.migrate();
        let after_one = (d.recipes.len(), d.retired.len());
        d.migrate();
        assert_eq!((d.recipes.len(), d.retired.len()), after_one);
    }

    #[test]
    fn a_hidden_coffee_stays_hidden_unless_it_would_empty_the_menu() {
        let mut d = Data::fresh();
        d.recipes[1].enabled = false;
        d.migrate();
        assert!(!d.recipes[1].enabled);

        for r in &mut d.recipes {
            r.enabled = false;
        }
        d.migrate();
        assert!(d.recipes.iter().all(|r| r.enabled), "an empty menu strands the user");
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
        assert_eq!(ordered(&d, false).last().unwrap().id, BUILT_INS[0].id);
        assert_eq!(ordered(&d, true).len(), 3);
    }
}
