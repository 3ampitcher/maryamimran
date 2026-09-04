# ☕ Qahwa

A tiny coffee machine that sits in the corner of your desktop.

When ChatGPT (or any other AI) gives you an answer that smells off, you drag the
coffee cup out of Qahwa and drop it into the chat box. It arrives as a normal
file upload — `☕ Reality Shot.md` — containing a prompt that tells the model to
go back over its last answer, separate fact from inference, verify what it can,
and say plainly where it was wrong.

No copy-pasting. No extension. No account.

```
Windows first · Tauri 2 + React · no backend, no database, no network calls
```

---

## The part that actually matters

The cup is not an image being faked into a drop event. Dragging it starts a
**native operating-system drag** carrying a real file:

- `pour_reality_shot` (Rust) writes `☕ Reality Shot.md` into its own directory
  under the system temp folder.
- It hands that path to [`drag`](https://crates.io/crates/drag), which on Windows
  performs an OLE `DoDragDrop` with a `CF_HDROP` payload — byte for byte what
  Explorer sends when you drag a file out of a folder.
- The browser on the other end cannot tell the difference between that and a file
  from your Downloads folder, which is why the drop lands in ChatGPT as an
  ordinary upload rather than as pasted text.

Two consequences worth knowing about:

**The window freezes mid-drag.** `DoDragDrop` blocks the main thread for the
whole gesture, and the web view repaints on that thread. So the UI paints its
"pouring" frame *before* handing the thread over (`App.tsx` waits two animation
frames), and the cup that follows your cursor is a native bitmap
(`src-tauri/assets/cup-drag.png`) drawn by the OS, not by the page. Nothing in a
web view can follow a cursor that has left the window.

**The file is deleted late, on purpose.** A drop hands the receiving app a
*path*, not bytes; the browser opens the file when the upload actually runs,
which is a beat after you let go. Deleting eagerly would race that read. So a
dropped shot lingers for two minutes and is then removed, a cancelled drag is
cleaned up immediately, and anything a crash left behind is swept at the next
launch. See `src-tauri/src/shot.rs`.

---

## Running it

Requires [Node](https://nodejs.org) 20+ and the
[Tauri prerequisites](https://tauri.app/start/prerequisites/) (on Windows: the
MSVC build tools, Rust, and WebView2 — which ships with Windows 11).

```bash
cd qahwa
npm install
npm run app:dev      # dev window with hot reload
npm run app:build    # -> src-tauri/target/release/bundle/nsis/Qahwa_0.1.0_x64-setup.exe
```

Frontend-only commands, if you just want to poke at the UI in a browser:

```bash
npm run dev          # http://localhost:5183 (the cup will not drag — no Tauri)
npm run build
npm run typecheck
node scripts/gen-assets.mjs   # regenerate icons + the drag bitmap
```

A prebuilt Windows installer is produced by
[`.github/workflows/qahwa-windows.yml`](../.github/workflows/qahwa-windows.yml)
on every push that touches `qahwa/`; grab it from the run's artifacts.

### Checking that the drag works

1. Launch Qahwa. It parks itself bottom-right, above the taskbar, always on top.
2. Open ChatGPT in a browser next to it.
3. Press and hold on the cup, drag across to the ChatGPT message box, release.
4. `☕ Reality Shot.md` should appear as an attachment. Send the message.

If the cup does not lift, the drag failed to start and the caption will say so —
the error is logged to the web view console (`npm run app:dev`, then right-click →
Inspect is disabled, so read stderr instead).

---

## Where things live

```
qahwa/
  src/
    App.tsx             state machine: idle → pouring → served, and the grab handler
    CoffeeMachine.tsx   the machine (SVG). Its viewBox landmarks are what the
                        cup is positioned against in styles.css
    Cup.tsx             the resting cup (SVG)
    Disclaimer.tsx      first-launch notice
    styles.css          fixed-size widget layout; the window cannot be resized
  src-tauri/
    src/lib.rs          the drag command and window placement
    src/shot.rs         temp-file lifecycle: pour, discard, sweep
    assets/
      reality-shot.md   THE PROMPT. Compiled into the binary; never shown in the UI
      cup-drag.png      the bitmap the OS drags under the cursor
    tauri.conf.json     frameless, transparent, always on top, 228x288
    capabilities/       deliberately small: no filesystem, no shell, no http
  scripts/
    render.mjs          a small PNG/ICO encoder, so icon generation needs no deps
    gen-assets.mjs      draws the icons and the drag bitmap
```

### Changing the prompt

Edit `src-tauri/assets/reality-shot.md` and rebuild. It is `include_str!`d into
the binary, so there is no prompt file on disk for anything to tamper with, and
nothing about it is surfaced in the UI.

---

## Privacy

Qahwa does not read or store your ChatGPT conversations. It has no network
permissions, no analytics, no telemetry, no account, and no database. The only
thing it ever writes is the temporary Markdown file you drag, and it deletes
that.

## Disclaimer

Qahwa asks AI to reconsider and verify its answer. It can still be wrong. Verify
important information.
