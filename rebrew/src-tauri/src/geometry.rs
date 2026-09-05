//! Where a window is allowed to sit, as arithmetic.
//!
//! Deliberately free of any Tauri types: this is the part with the awkward
//! cases — unplugged monitors, negative coordinates, a window larger than the
//! screen — and keeping it pure is what makes those cases testable.

/// x, y, width, height, in physical pixels.
pub type Rect = (i32, i32, i32, i32);

/// How much of a window has to be on a screen for it to count as reachable.
/// Roughly "enough of the header strip to grab and drag it back".
const MIN_VISIBLE_AREA: i64 = 120 * 40;

pub fn overlap(a: Rect, b: Rect) -> i64 {
    let w = (a.0 + a.2).min(b.0 + b.2) - a.0.max(b.0);
    let h = (a.1 + a.3).min(b.1 + b.3) - a.1.max(b.1);
    if w <= 0 || h <= 0 {
        0
    } else {
        w as i64 * h as i64
    }
}

fn centre(r: Rect) -> (i64, i64) {
    (r.0 as i64 + r.2 as i64 / 2, r.1 as i64 + r.3 as i64 / 2)
}

fn distance_squared(a: Rect, b: Rect) -> i64 {
    let (ax, ay) = centre(a);
    let (bx, by) = centre(b);
    (ax - bx).pow(2) + (ay - by).pow(2)
}

/// Slides a rectangle until it sits inside `area`. If the window is larger than
/// the screen the top-left corner wins — a visible header beats a centred one.
pub fn clamp_into(area: Rect, win: Rect) -> (i32, i32) {
    let x = win.0.min(area.0 + area.2 - win.2).max(area.0);
    let y = win.1.min(area.1 + area.3 - win.3).max(area.1);
    (x, y)
}

/// The saved position, or the nearest visible screen if that position no longer
/// exists — which is what happens when a second monitor is unplugged.
pub fn reachable_position(screens: &[Rect], win: Rect) -> (i32, i32) {
    if screens.is_empty() {
        return (win.0, win.1);
    }
    let best = screens.iter().map(|s| overlap(*s, win)).max().unwrap_or(0);
    if best >= MIN_VISIBLE_AREA {
        return (win.0, win.1);
    }
    let nearest = screens
        .iter()
        .min_by_key(|s| distance_squared(**s, win))
        .expect("screens is not empty");
    clamp_into(*nearest, win)
}

#[cfg(test)]
mod tests {
    use super::*;

    const LAPTOP: Rect = (0, 0, 1920, 1040);
    const SECOND: Rect = (1920, 0, 1920, 1040);
    const WIN: (i32, i32) = (280, 330);

    #[test]
    fn a_window_already_onscreen_is_left_alone() {
        let win = (1500, 700, WIN.0, WIN.1);
        assert_eq!(reachable_position(&[LAPTOP, SECOND], win), (1500, 700));
    }

    #[test]
    fn a_window_on_a_second_monitor_stays_there_while_it_exists() {
        let win = (2400, 500, WIN.0, WIN.1);
        assert_eq!(reachable_position(&[LAPTOP, SECOND], win), (2400, 500));
    }

    #[test]
    fn a_window_on_an_unplugged_monitor_comes_back() {
        let win = (2400, 500, WIN.0, WIN.1);
        let (x, y) = reachable_position(&[LAPTOP], win);
        assert!(overlap(LAPTOP, (x, y, WIN.0, WIN.1)) > 0, "still offscreen at {x},{y}");
        assert!(x >= 0 && x + WIN.0 <= 1920 && y >= 0 && y + WIN.1 <= 1040);
    }

    #[test]
    fn a_barely_visible_sliver_still_counts_as_lost() {
        // Ten pixels poking onto the screen is not something you can grab.
        let win = (1910, 500, WIN.0, WIN.1);
        let (x, _) = reachable_position(&[LAPTOP], win);
        assert!(x + WIN.0 <= 1920, "a 10px sliver was treated as reachable");
    }

    #[test]
    fn a_window_above_the_top_edge_comes_back_down() {
        let win = (400, -900, WIN.0, WIN.1);
        let (_, y) = reachable_position(&[LAPTOP], win);
        assert!(y >= 0, "title bar left above the screen at y={y}");
    }

    #[test]
    fn negative_coordinates_are_fine_when_a_monitor_lives_there() {
        let left = (-1920, 0, 1920, 1040);
        let win = (-1500, 300, WIN.0, WIN.1);
        assert_eq!(reachable_position(&[left, LAPTOP], win), (-1500, 300));
    }

    #[test]
    fn a_window_bigger_than_the_screen_keeps_its_top_left_visible() {
        let tiny = (0, 0, 200, 200);
        assert_eq!(clamp_into(tiny, (999, 999, 520, 650)), (0, 0));
    }

    #[test]
    fn with_no_monitors_reported_nothing_moves() {
        assert_eq!(reachable_position(&[], (5, 6, WIN.0, WIN.1)), (5, 6));
    }

    #[test]
    fn it_returns_to_the_nearer_of_two_remaining_screens() {
        let far_left = (-3000, 0, 1000, 800);
        let win = (2400, 500, WIN.0, WIN.1); // was off to the right
        let (x, _) = reachable_position(&[far_left, LAPTOP], win);
        assert!(x > 0, "came back to the far screen instead of the near one");
    }
}
