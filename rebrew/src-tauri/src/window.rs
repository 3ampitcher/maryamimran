//! Placing the window, using the arithmetic in `geometry`.

use tauri::{PhysicalPosition, PhysicalSize, WebviewWindow, Wry};

use crate::geometry::{self, Rect};
use crate::store::Geometry;

/// Gap from the corner of the work area on a first launch, in logical pixels.
const CORNER_MARGIN: f64 = 24.0;

fn work_areas(window: &WebviewWindow<Wry>) -> Vec<Rect> {
    window
        .available_monitors()
        .unwrap_or_default()
        .iter()
        .map(|m| {
            let a = m.work_area();
            (a.position.x, a.position.y, a.size.width as i32, a.size.height as i32)
        })
        .collect()
}

/// Parks the window near the bottom-right of the work area — above the taskbar,
/// not under it. Used only when there is nothing remembered.
pub fn settle_in_corner(window: &WebviewWindow<Wry>) -> tauri::Result<()> {
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

/// Restores a remembered size and position, or falls back to the corner.
pub fn place(window: &WebviewWindow<Wry>, saved: Option<Geometry>) -> tauri::Result<()> {
    let Some(g) = saved else {
        return settle_in_corner(window);
    };

    // Size first: the position we choose depends on how big the window is, and
    // the minimum and maximum in tauri.conf.json clamp it for us.
    window.set_size(PhysicalSize::new(g.width, g.height))?;
    let size = window.outer_size()?;
    let win = (g.x, g.y, size.width as i32, size.height as i32);

    let (x, y) = geometry::reachable_position(&work_areas(window), win);
    window.set_position(PhysicalPosition::new(x, y))
}

pub fn geometry_of(window: &WebviewWindow<Wry>) -> Option<Geometry> {
    let pos = window.outer_position().ok()?;
    let size = window.outer_size().ok()?;
    if size.width == 0 || size.height == 0 {
        return None; // minimised; not a position worth remembering
    }
    Some(Geometry { x: pos.x, y: pos.y, width: size.width, height: size.height })
}
