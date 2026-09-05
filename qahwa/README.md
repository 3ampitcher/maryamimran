# ☕ Qahwa

A small coffee machine that sits on your desktop. Each coffee is a prompt.

Pick one, drag its cup into ChatGPT or Claude, and it arrives as a normal file
upload — `☕ Espresso - Reality Shot.md` — carrying instructions the AI then
follows. No copy-pasting, no extension, no account.

```
Windows and macOS · Tauri 2 + React · no backend, no database, no network calls
```

---

## The part that actually matters

The cup is not an image being faked into a drop event. Dragging it starts a
**native operating-system drag** carrying a real file:

- `pour` (Rust) writes the selected recipe into its own directory under the
  system temp folder, under that recipe's own file name.
- It hands the path to [`drag`](https://crates.io/crates/drag), which on Windows
  performs an OLE `DoDragDrop` with a `CF_HDROP` payload — byte for byte what
  Explorer sends when you drag a file out of a folder — and on macOS an
  `NSDraggingSession`.
- The browser on the other end cannot tell the difference between that and a
  file from your Downloads folder, which is why the drop lands as an ordinary
  upload rather than as pasted text.

Four consequences are handled deliberately, and are worth knowing before
changing any of it:

**The window freezes mid-drag.** `DoDragDrop` blocks the main thread for the
whole gesture, and the web view repaints on that thread. So the UI paints its
"pouring" frame *before* handing the thread over (`Carousel.tsx` waits for a
frame, with a timeout in case the web view throttles them), and the cup that
follows your cursor is a native bitmap drawn by the OS, not by the page.

**A click is not a drag.** Windows reports a drag that opens and closes on the
spot as a *successful drop*, whether or not anything caught it. So the cup waits
for the cursor to move a few pixels before starting anything — otherwise a stray
click would leave a file in the temp folder and the app would claim it had
served a coffee that went nowhere.

**Only the cup drags.** The cup shares the machine's SVG coordinate space, in a
layer that covers the whole stage but is transparent to the pointer everywhere
except the cup itself. The arrows, the header and the machine stay ordinary
controls. There is a test for each of them.

**The file is deleted late, on purpose.** A drop hands the receiving app a
*path*, not bytes; the browser opens the file when the upload actually runs,
which is a beat after you let go. Deleting eagerly would race that read. So a
dropped file lingers for two minutes, a cancelled drag is cleaned up
immediately, and anything a crash left behind is swept at the next launch. See
`src-tauri/src/shot.rs`.

---

## Using it

**Choose a coffee** with the arrows either side of the name, the dots beneath
it, or the left and right arrow keys. Whichever cup is on the tray is the one
that pours. Your choice is remembered.

**Drag the cup** into the chat box of ChatGPT, Claude, or anything else that
accepts an uploaded file, then send the message.

**The ⓘ button** explains the selected coffee and opens its recipe. **The ⚙
button** holds settings and the recipe library.

### The menu

| Coffee | What it does |
| --- | --- |
| **Espresso** — Reality Shot | Checks the last answer for factual errors, weak claims and missing evidence. |
| **Cappuccino** — Human Touch | Makes writing sound natural and personal without changing its meaning. |
| **Americano** — Pressure Test | Challenges an idea to reveal its strongest risks, assumptions and blind spots. |
| **Cold Brew** — Fresh Eyes | Escapes the first idea and discovers genuinely different ways to reach the goal. |
| **Cortado** — Decision Table | Compares known options and recommends the best fit for what matters to you. |
| **Flat White** — Action Plan | Turns a chosen goal into realistic priorities, steps and checkpoints. |

### Editing and adding recipes

**⚙ → Manage recipes.** Every coffee can be edited, duplicated, reordered, and
hidden from the carousel. Recipes you create yourself can also be deleted;
built-in ones can only be hidden, and an edited built-in can be put back the way
it was with the ⟲ button.

A recipe is a coffee type, a purpose, a one-line explanation, a cup, a colour,
and the prompt itself. The file name follows from the first three:
`☕ {coffee} - {purpose}.md`. The editor previews it before you save.

**Export** writes every recipe to a JSON file; **import** merges one back in,
replacing recipes with the same id and adding the rest. Coffee names keep their
Unicode, so `☕` and `🧊` survive the round trip.

Cups and colours are a closed set of presets. There is no way to point a recipe
at an arbitrary file or a remote image, by design.

### The window

Qahwa is an **ordinary desktop window**: other applications cover it normally.
It opens near the bottom-right the first time, and after that remembers where
you put it and how big you made it. If the monitor it was last on has since been
unplugged, it comes back to one that exists.

**Keep above other apps** (⚙, off by default) makes it float over everything
else. A dot appears in the header while that is on.

**The tray icon** is how you find the window once something covers it: click to
show and focus, or use its menu to show, hide, toggle keep-above, or exit. The
header's ✕ hides the window when there is a tray to restore it from, and quits
when there is not — so the app can never end up running with no way to reach it.

Drag the **dotted strip** at the top to move the window. Drag any edge to resize
it, between 230×280 and 520×650.

---

## Running it from source

Requires [Node](https://nodejs.org) 20+ and the
[Tauri prerequisites](https://tauri.app/start/prerequisites/) — on Windows the
MSVC build tools, Rust, and WebView2 (which ships with Windows 11); on macOS
Xcode command line tools and Rust.

```bash
cd qahwa
npm install
npm run app:dev              # dev window with hot reload

npm run app:build:windows    # -> src-tauri/target/release/bundle/nsis/Qahwa_0.2.0_x64-setup.exe
npm run app:build:mac        # -> src-tauri/target/release/bundle/dmg/Qahwa_0.2.0_aarch64.dmg
```

Frontend-only, if you just want to poke at the UI in a browser:

```bash
npm run dev          # http://localhost:5183 (the cup will not drag — no Tauri)
npm run build
npm run typecheck
node scripts/gen-assets.mjs   # regenerate the icons and the drag bitmap
```

### Tests

```bash
cd src-tauri && cargo test    # recipes, the store's migration rules, window geometry
npx playwright install chromium
npm run build && npm run test:ui   # the drag gesture and the carousel
```

The Rust tests cover the parts with awkward edge cases: that upgrading never
overwrites an edited recipe, that the six built-in file names are exactly what
the product asks for, and that a window last seen on an unplugged monitor comes
back somewhere reachable. The browser tests cover what the UI decides — when to
start a drag, which recipe it pours, and that nothing except the cup drags a
file out.

Both suites run in CI on real Windows and macOS
([`.github/workflows/qahwa.yml`](../.github/workflows/qahwa.yml)), which is also
where the installers come from.

### Installing an unsigned build

Neither build is code-signed, so both operating systems will object the first
time:

- **Windows** shows "Windows protected your PC" → **More info** → **Run anyway**.
- **macOS** refuses to open it at all on a double-click. Right-click the app →
  **Open** → **Open**, or run `xattr -dr com.apple.quarantine /Applications/Qahwa.app`.

Neither is a malware warning. Both mean the same thing: nobody has paid for a
certificate.

---

## Where things live

```
qahwa/
  src/
    App.tsx           the shell, and which screen is showing
    Carousel.tsx      the main screen: the cup, the drag, the arrows
    Cups.tsx          ten coffee visuals, all drawn on one baseline
    CoffeeMachine.tsx the machine. Its viewBox is what the cup is placed against
    Library.tsx       list, reorder, hide, duplicate, reset, delete
    Editor.tsx        the only screen that shows a prompt body
    Info.tsx          what Qahwa is, and what it does not do
    SettingsPanel.tsx preferences, window, import/export
    api.ts            every call into Rust, typed
    ui.tsx            Sheet, Toggle, Confirm, Escape handling
  src-tauri/
    src/lib.rs        commands, the tray, the drag
    src/recipes.rs    the built-in menu and the presets
    src/store.rs      one JSON file: recipes, preferences, geometry
    src/geometry.rs   which screen a window can actually be seen on
    src/window.rs     placing the window, using the above
    src/shot.rs       temp-file lifecycle: pour, discard, sweep
    assets/recipes/   the six prompts, compiled into the binary
  tests/gesture.mjs   press, drag, cancel, click, and what must not drag
```

### Changing a built-in prompt

Edit the file in `src-tauri/assets/recipes/` and rebuild. They are `include_str!`d
into the binary, so there is no prompt file on disk for anything to tamper with,
and "reset this recipe" always has an original to restore from.

Note that an installed copy keeps its own edited version in the store — a new
build's prompt only reaches someone who has not edited that recipe. Adding a new
coffee to `BUILT_INS` is safe: it appears for everyone on the next launch,
without touching anything they have changed.

---

## Privacy

Qahwa does not read or store your chats. Recipes and preferences stay on this
device, in one JSON file (⚙ shows you where). There is no account, no server, no
analytics, and no network permission of any kind — the only thing it ever writes
elsewhere is the temporary file you drag, and it deletes that.

## Accuracy

Qahwa asks AI to reconsider and verify its answer. **It can still be wrong.**
Verify important medical, legal, financial and safety-related information.

The research steps in several recipes only work when the receiving chatbot has
browsing or other tools available. Nothing here guarantees an accurate answer or
removes hallucinations.
