//! Lifecycle of the temporary Markdown file that gets dragged out.
//!
//! Each pour gets its own directory under the system temp folder, so the file
//! itself can always carry the exact name the recipe asks for without ever
//! colliding with a pour that is still being read by the app it was dropped
//! into.

use std::{
    fs,
    io,
    path::{Path, PathBuf},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, SystemTime, UNIX_EPOCH},
};

/// How long a dropped file is left on disk. A drop hands the receiving app a
/// path, not bytes — the browser reads the file when the upload actually runs,
/// which is a moment after the cursor is released. Deleting eagerly would race
/// that read.
pub const LINGER: Duration = Duration::from_secs(120);

fn shots_dir() -> PathBuf {
    std::env::temp_dir().join("qahwa-shots")
}

/// Monotonic-enough directory name: time, process, and a counter, so two pours
/// in the same millisecond still land in different directories.
fn unique_id() -> String {
    static COUNTER: AtomicU64 = AtomicU64::new(0);
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    format!(
        "{nanos:x}-{:x}-{:x}",
        std::process::id(),
        COUNTER.fetch_add(1, Ordering::Relaxed)
    )
}

/// Writes one recipe out under its own name and returns the path to hand to the
/// drag operation.
pub fn pour(file_name: &str, contents: &str) -> io::Result<PathBuf> {
    let dir = shots_dir().join(unique_id());
    fs::create_dir_all(&dir)?;
    let path = dir.join(file_name);
    fs::write(&path, contents)?;
    Ok(path)
}

/// Removes a poured file and the directory it was written into.
pub fn discard(path: &Path) {
    if let Some(dir) = path.parent() {
        // Only ever recurse into a directory we created ourselves.
        if dir.parent() == Some(shots_dir().as_path()) {
            let _ = fs::remove_dir_all(dir);
            return;
        }
    }
    let _ = fs::remove_file(path);
}

/// Clears out pours older than `min_age`. Run at startup and at exit so a crash
/// or a hard kill cannot leave files behind indefinitely, while an upload that
/// is still in flight is left alone.
pub fn sweep(min_age: Duration) {
    let Ok(entries) = fs::read_dir(shots_dir()) else {
        return; // nothing has been poured yet
    };
    for entry in entries.flatten() {
        let stale = entry
            .metadata()
            .and_then(|m| m.modified())
            .and_then(|t| SystemTime::now().duration_since(t).map_err(io::Error::other))
            .map(|age| age >= min_age)
            .unwrap_or(false);
        if stale {
            let _ = fs::remove_dir_all(entry.path());
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn each_pour_gets_its_own_directory_so_names_can_repeat() {
        let a = pour("☕ Espresso - Reality Shot.md", "one").unwrap();
        let b = pour("☕ Espresso - Reality Shot.md", "two").unwrap();
        assert_ne!(a, b, "two pours collided");
        assert_eq!(a.file_name(), b.file_name(), "the name must be the recipe's");
        assert_eq!(fs::read_to_string(&a).unwrap(), "one");
        assert_eq!(fs::read_to_string(&b).unwrap(), "two");
        discard(&a);
        discard(&b);
        assert!(!a.exists() && !b.exists());
    }

    #[test]
    fn discard_removes_the_whole_pour_directory() {
        let p = pour("🧊 Cold Brew - Fresh Eyes.md", "x").unwrap();
        let dir = p.parent().unwrap().to_path_buf();
        discard(&p);
        assert!(!dir.exists());
    }

    #[test]
    fn sweep_leaves_a_pour_that_may_still_be_uploading() {
        let p = pour("☕ Keep me.md", "x").unwrap();
        sweep(Duration::from_secs(120));
        assert!(p.exists(), "a fresh pour was swept away mid-upload");
        discard(&p);
    }
}
