//! Lifecycle of the temporary "Reality Shot" file.
//!
//! Each pour gets its own directory under the system temp folder, so the file
//! itself can always carry the exact name we want without ever colliding with a
//! shot that is still being read by the app it was dropped into.

use std::{
    fs,
    io,
    path::{Path, PathBuf},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, SystemTime, UNIX_EPOCH},
};

/// The prompt itself lives in the binary, not on disk and not in the UI.
const PROMPT: &str = include_str!("../assets/reality-shot.md");

/// What the receiving application will show as the attachment name.
const FILE_NAME: &str = "☕ Reality Shot.md";

/// How long a dropped shot is left on disk. A drop hands the receiving app a
/// path, not bytes — the browser reads the file when the upload actually runs,
/// which can be a moment after the cursor is released. Deleting eagerly would
/// race that read.
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

/// Writes a fresh shot and returns the path to hand to the drag operation.
pub fn pour() -> io::Result<PathBuf> {
    let dir = shots_dir().join(unique_id());
    fs::create_dir_all(&dir)?;
    let path = dir.join(FILE_NAME);
    fs::write(&path, PROMPT)?;
    Ok(path)
}

/// Removes a shot and the directory it was poured into.
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

/// Clears out shots older than `min_age`. Run at startup and at exit so a crash
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
