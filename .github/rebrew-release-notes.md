# ☕ Rebrew

A café for better AI answers. A small coffee machine that sits on your desktop.
Each coffee is a prompt: pick one, drag it into ChatGPT or Claude, and the AI
gets a file telling it to go and do that work on the answer it just gave you.

**Windows 10 or 11**, and **macOS** (Apple silicon).

## How to install it

1. Download **`Rebrew_0.4.0_x64-setup.exe`** from the Assets list below.
   (Or `Rebrew-portable.exe` if you would rather not install anything — that one
   just runs when you double-click it.)
2. Your browser may say the file "isn't commonly downloaded". Choose **Keep**.
3. Double-click the file. Windows will show a blue box saying
   **"Windows protected your PC"**. Click **More info**, then **Run anyway**.

That blue box is expected. It appears for any program that has not been signed
with a paid certificate, which costs a few hundred dollars a year — it is not a
virus warning. This app was built automatically from public source code, and you
can read every line of it in this repository.

If the installer says **"Error opening file for writing"**, the folder you chose
is not one you can write to. Leave the default
(`C:\Users\<you>\AppData\Local\Rebrew`), or use `Rebrew-portable.exe` instead.

## How to use it

Rebrew opens near the **bottom-right** of your screen, as an ordinary window —
other apps cover it normally. ⚙ → *Keep above other apps* changes that.

1. Open ChatGPT (or Claude) in your browser.
2. Ask it something.
3. Press and hold on the coffee, drag it across into the message box, and let go.
4. A file appears attached — `APPLY NOW — Check the Answer.md`, or whichever
   coffee you dragged. Send the message.

The AI does the work straight away rather than asking what you would like done
with the file.

### The four coffees

| Coffee | What it does |
| --- | --- |
| **Espresso** — Reality Shot | Checks facts, sources and weak assumptions. |
| **Cappuccino** — Human Touch | Makes your writing sound natural without changing the meaning. |
| **Latte** — Second Opinion | Breaks out of the first idea and finds different directions. |
| **Americano** — The Challenger | Tests your idea like a skeptical judge or investor. |

### The window

- The **grid button** in the header shows all four coffees at once. Any of them
  drags straight into a chat from there; clicking one picks it and goes back to
  the machine. Rebrew opens on whichever view you used last.
- The **?** button explains the menu. **⚙** holds settings and lets you edit any
  coffee's prompt.
- Drag the strip at the top to **move** the window; drag an edge to **resize**
  it. Where you put it and how big you made it are remembered.
- **✕** hides it to the system tray; click the tray icon to bring it back.

## Please tell me

- Did the coffee actually drop into the chat box?
- Did the AI get on with the work, or ask what to do with the file?
- Did the cup that followed your cursor match the coffee you dragged?
- Did anything look cut off or oddly coloured?

## Two things to know

Rebrew asks AI to reconsider and verify its answer. **It can still be wrong.**
Verify anything that matters — medical, legal, financial or safety — yourself.

Rebrew does not read or store your conversations. It makes no network calls,
keeps no history, and has no account.
