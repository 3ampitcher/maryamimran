//! The Rebrew menu: four coffees, and the presets they are drawn from.
//!
//! Prompt bodies are `include_str!`d rather than read from disk: they ship
//! inside the binary, so there is no file for anything else to tamper with, and
//! "restore the Rebrew default" always has an original to go back to.

/// A drink the user can choose. The frontend draws each one; the id is the only
/// thing shared between the two sides.
pub struct IconPreset {
    pub id: &'static str,
    pub label: &'static str,
}

/// Four drinks, one visual system. Deliberately closed: a recipe cannot point
/// at anything that is not drawn here.
pub const ICONS: &[IconPreset] = &[
    IconPreset { id: "espresso", label: "Espresso cup" },
    IconPreset { id: "cappuccino", label: "Cappuccino cup" },
    IconPreset { id: "latte", label: "Iced latte glass" },
    IconPreset { id: "americano", label: "Iced americano glass" },
];

pub fn is_known_icon(id: &str) -> bool {
    ICONS.iter().any(|i| i.id == id)
}

/// Accent colours, kept as named presets so a recipe can never carry arbitrary
/// CSS into the UI.
pub const ACCENTS: &[(&str, &str)] = &[
    ("espresso", "#8C5A3B"),
    ("amber", "#E0A458"),
    ("caramel", "#C98A4B"),
    ("cream", "#E8D9C6"),
    ("ice", "#7FA9C4"),
    ("rose", "#C97F84"),
    ("sage", "#8FA37E"),
    ("slate", "#8A8F98"),
];

pub fn is_known_accent(id: &str) -> bool {
    ACCENTS.iter().any(|(a, _)| *a == id)
}

pub struct BuiltIn {
    pub id: &'static str,
    pub name: &'static str,
    pub purpose: &'static str,
    pub explanation: &'static str,
    pub prompt: &'static str,
    pub icon: &'static str,
    pub accent: &'static str,
    /// The name the file arrives under in the chat, without the extension.
    ///
    /// Separate from `purpose` on purpose. The purpose is the café name shown
    /// in the window — "Reality Shot" — and the user may edit it. The file name
    /// is read by an AI before it reads a word of the file, so it says what to
    /// do rather than what to call it, and it does not move when the label in
    /// the window does.
    pub file_stem: &'static str,
}

pub const BUILT_INS: &[BuiltIn] = &[
    BuiltIn {
        id: "builtin.espresso",
        name: "Espresso",
        purpose: "Reality Shot",
        explanation: "Checks facts, sources and weak assumptions.",
        prompt: include_str!("../assets/recipes/espresso-reality-shot.md"),
        icon: "espresso",
        accent: "espresso",
        file_stem: "APPLY NOW — Check the Answer",
    },
    BuiltIn {
        id: "builtin.cappuccino",
        name: "Cappuccino",
        purpose: "Human Touch",
        explanation: "Makes your writing sound natural without changing the meaning.",
        prompt: include_str!("../assets/recipes/cappuccino-human-touch.md"),
        icon: "cappuccino",
        accent: "cream",
        file_stem: "APPLY NOW — Make It Human",
    },
    BuiltIn {
        id: "builtin.latte",
        name: "Latte",
        purpose: "Second Opinion",
        explanation: "Breaks out of the first idea and finds different directions.",
        prompt: include_str!("../assets/recipes/latte-second-opinion.md"),
        icon: "latte",
        accent: "caramel",
        file_stem: "APPLY NOW — Find Another Direction",
    },
    BuiltIn {
        id: "builtin.americano",
        name: "Americano",
        purpose: "The Challenger",
        explanation: "Tests your idea like a skeptical judge or investor.",
        prompt: include_str!("../assets/recipes/americano-the-challenger.md"),
        icon: "americano",
        accent: "slate",
        file_stem: "APPLY NOW — Challenge the Idea",
    },
];

pub fn built_in(id: &str) -> Option<&'static BuiltIn> {
    BUILT_INS.iter().find(|b| b.id == id)
}

/// The name the dragged file arrives under, e.g. `APPLY NOW — Check the
/// Answer.md`.
///
/// The receiving chat shows the file name above the file, so it is the first
/// thing an AI reads — and a name that only labels the contents invites it to
/// describe them. This one asks for the work instead. Windows forbids
/// `\ / : * ? " < > |` in a file name and the fallback is editable text, so
/// anything illegal becomes a dash rather than failing the drag.
pub fn file_name(stem: &str, fallback: &str) -> String {
    let safe = |s: &str| -> String {
        s.chars()
            .map(|c| if r#"\/:*?"<>|"#.contains(c) || c.is_control() { '-' } else { c })
            .collect::<String>()
            .trim()
            .to_string()
    };
    let stem = match (safe(stem), safe(fallback)) {
        (p, _) if !p.is_empty() => p,
        (_, f) if !f.is_empty() => f,
        _ => "Rebrew recipe".to_string(),
    };
    format!("{stem}.md")
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The four file names in the product brief, spelled out. A rename here
    /// changes what lands in someone's chat, so it should fail loudly.
    #[test]
    fn built_in_file_names_match_the_brief() {
        let expected = [
            "APPLY NOW — Check the Answer.md",
            "APPLY NOW — Make It Human.md",
            "APPLY NOW — Find Another Direction.md",
            "APPLY NOW — Challenge the Idea.md",
        ];
        for (b, want) in BUILT_INS.iter().zip(expected) {
            assert_eq!(file_name(b.file_stem, b.name), want);
        }
    }

    /// The em dash is legal on Windows; the sanitiser must not eat it, and the
    /// names must survive intact rather than arriving as `APPLY NOW - ...`.
    #[test]
    fn the_file_names_survive_the_sanitiser() {
        for b in BUILT_INS {
            let n = file_name(b.file_stem, b.name);
            assert!(n.starts_with("APPLY NOW — "), "{n}");
            assert!(!r#"\/:*?"<>|"#.chars().any(|c| n.contains(c)), "{n}");
        }
    }

    /// Every prompt begins with the wrapper, exactly, and carries no heading
    /// above it — an AI that reads a title first treats the rest as a document
    /// to describe rather than an instruction to carry out.
    #[test]
    fn every_prompt_opens_with_the_wrapper() {
        const WRAPPER: &str = "Immediately apply the instructions below to the most recent \
relevant user request and your latest answer in this conversation. Do not summarize, describe or \
review this file. Do not ask what should be done with it. Perform the requested work now. If \
there is no previous answer to revise, apply the instructions directly to the user's latest \
request.";
        for b in BUILT_INS {
            assert!(b.prompt.starts_with(WRAPPER), "{} does not open with the wrapper", b.id);
            assert!(!b.prompt.contains('#'), "{} still has a Markdown heading", b.id);
        }
    }

    /// The file is read by an AI that has never heard of this app, and naming
    /// the product or the drink is an invitation to talk about the file
    /// instead of doing what it says.
    #[test]
    fn no_prompt_names_the_app_or_the_drink() {
        for b in BUILT_INS {
            for word in ["Rebrew", "Qahwa", b.name, b.purpose] {
                assert!(!b.prompt.contains(word), "{} mentions {word}", b.id);
            }
        }
    }

    #[test]
    fn the_menu_is_the_four_coffees_in_order() {
        let order: Vec<_> = BUILT_INS.iter().map(|b| (b.name, b.purpose)).collect();
        assert_eq!(
            order,
            vec![
                ("Espresso", "Reality Shot"),
                ("Cappuccino", "Human Touch"),
                ("Latte", "Second Opinion"),
                ("Americano", "The Challenger"),
            ]
        );
    }

    #[test]
    fn every_built_in_is_complete_and_distinct() {
        let mut ids = std::collections::HashSet::new();
        for b in BUILT_INS {
            assert!(ids.insert(b.id), "duplicate id {}", b.id);
            assert!(is_known_icon(b.icon), "{} has an unknown icon", b.id);
            assert!(is_known_accent(b.accent), "{} has an unknown accent", b.id);
            assert!(!b.explanation.is_empty());
            assert!(b.prompt.len() > 200, "{} has a suspiciously short prompt", b.id);
        }
        // Every drink is drawn, and every drawing is used.
        assert_eq!(ICONS.len(), BUILT_INS.len());
    }

    #[test]
    fn illegal_characters_never_reach_the_file_system() {
        let n = file_name("A/B:C?", "Espresso");
        assert!(!n.contains('/') && !n.contains(':') && !n.contains('?'), "{n}");
        assert!(n.ends_with(".md"));
        assert_eq!(file_name("  ", "Espresso"), "Espresso.md");
        assert_eq!(file_name("", ""), "Rebrew recipe.md");
    }
}
