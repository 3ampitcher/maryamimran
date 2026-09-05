//! The built-in coffee menu, and the presets a custom recipe can be built from.
//!
//! Prompt bodies are `include_str!`d rather than read from disk: they ship
//! inside the binary, so there is no file for anything else to tamper with, and
//! "reset this recipe" always has an original to restore.

/// A cup shape the user can choose. The frontend draws each one; the emoji here
/// is what the dragged file's name starts with, so the two must stay in step.
pub struct IconPreset {
    pub id: &'static str,
    pub label: &'static str,
    pub emoji: &'static str,
}

pub const ICONS: &[IconPreset] = &[
    IconPreset { id: "espresso", label: "Espresso cup", emoji: "☕" },
    IconPreset { id: "cappuccino", label: "Cappuccino cup", emoji: "☕" },
    IconPreset { id: "americano", label: "Americano mug", emoji: "☕" },
    IconPreset { id: "cold-brew", label: "Cold-brew glass", emoji: "🧊" },
    IconPreset { id: "cortado", label: "Cortado glass", emoji: "☕" },
    IconPreset { id: "flat-white", label: "Flat-white cup", emoji: "☕" },
    IconPreset { id: "latte", label: "Latte glass", emoji: "☕" },
    IconPreset { id: "mocha", label: "Mocha mug", emoji: "☕" },
    IconPreset { id: "turkish", label: "Turkish coffee cup", emoji: "☕" },
    IconPreset { id: "travel", label: "Travel cup", emoji: "☕" },
];

pub fn icon_emoji(id: &str) -> &'static str {
    ICONS.iter().find(|i| i.id == id).map_or("☕", |i| i.emoji)
}

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
}

pub const BUILT_INS: &[BuiltIn] = &[
    BuiltIn {
        id: "builtin.espresso",
        name: "Espresso",
        purpose: "Reality Shot",
        explanation: "Checks the last answer for factual errors, weak claims and missing evidence.",
        prompt: include_str!("../assets/recipes/espresso-reality-shot.md"),
        icon: "espresso",
        accent: "espresso",
    },
    BuiltIn {
        id: "builtin.cappuccino",
        name: "Cappuccino",
        purpose: "Human Touch",
        explanation: "Makes writing sound natural and personal without changing its meaning.",
        prompt: include_str!("../assets/recipes/cappuccino-human-touch.md"),
        icon: "cappuccino",
        accent: "cream",
    },
    BuiltIn {
        id: "builtin.americano",
        name: "Americano",
        purpose: "Pressure Test",
        explanation: "Challenges an idea to reveal its strongest risks, assumptions and blind spots.",
        prompt: include_str!("../assets/recipes/americano-pressure-test.md"),
        icon: "americano",
        accent: "slate",
    },
    BuiltIn {
        id: "builtin.cold-brew",
        name: "Cold Brew",
        purpose: "Fresh Eyes",
        explanation: "Escapes the first idea and discovers genuinely different ways to reach the goal.",
        prompt: include_str!("../assets/recipes/cold-brew-fresh-eyes.md"),
        icon: "cold-brew",
        accent: "ice",
    },
    BuiltIn {
        id: "builtin.cortado",
        name: "Cortado",
        purpose: "Decision Table",
        explanation: "Compares known options and recommends the best fit for what matters to you.",
        prompt: include_str!("../assets/recipes/cortado-decision-table.md"),
        icon: "cortado",
        accent: "caramel",
    },
    BuiltIn {
        id: "builtin.flat-white",
        name: "Flat White",
        purpose: "Action Plan",
        explanation: "Turns a chosen goal into realistic priorities, steps and checkpoints.",
        prompt: include_str!("../assets/recipes/flat-white-action-plan.md"),
        icon: "flat-white",
        accent: "amber",
    },
];

pub fn built_in(id: &str) -> Option<&'static BuiltIn> {
    BUILT_INS.iter().find(|b| b.id == id)
}

/// The name the dragged file arrives under, e.g. `☕ Espresso - Reality Shot.md`.
///
/// Windows forbids `\ / : * ? " < > |` in a file name, and a recipe name is
/// free text, so anything illegal becomes a dash rather than failing the drag.
pub fn file_name(icon: &str, name: &str, purpose: &str) -> String {
    let safe = |s: &str| -> String {
        s.chars()
            .map(|c| if r#"\/:*?"<>|"#.contains(c) || c.is_control() { '-' } else { c })
            .collect::<String>()
            .trim()
            .to_string()
    };
    let name = safe(name);
    let purpose = safe(purpose);
    let stem = if purpose.is_empty() { name } else { format!("{name} - {purpose}") };
    let stem = if stem.is_empty() { "Qahwa recipe".to_string() } else { stem };
    format!("{} {}.md", icon_emoji(icon), stem)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The six file names in the product brief, spelled out. If a rename ever
    /// changes what lands in someone's chat, it should fail here first.
    #[test]
    fn built_in_file_names_match_the_brief() {
        let expected = [
            "☕ Espresso - Reality Shot.md",
            "☕ Cappuccino - Human Touch.md",
            "☕ Americano - Pressure Test.md",
            "🧊 Cold Brew - Fresh Eyes.md",
            "☕ Cortado - Decision Table.md",
            "☕ Flat White - Action Plan.md",
        ];
        for (b, want) in BUILT_INS.iter().zip(expected) {
            assert_eq!(file_name(b.icon, b.name, b.purpose), want);
        }
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
    }

    #[test]
    fn illegal_characters_never_reach_the_file_system() {
        let n = file_name("espresso", "My/Recipe", "A:B?");
        assert!(!n.contains('/') && !n.contains(':') && !n.contains('?'), "{n}");
        assert!(n.ends_with(".md"));
        assert_eq!(file_name("espresso", "  ", ""), "☕ Qahwa recipe.md");
    }
}
