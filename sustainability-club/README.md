# UBT Sustainability Club — website

A single-page club website with six playable mini-games. Plain HTML, CSS and
JavaScript: no build step, no framework, no backend, no database, no analytics,
no cookies, and **no personal information is ever collected or stored** —
there is not a single form field on the page.

```
sustainability-club/
├── index.html          the whole page
├── assets/
│   ├── styles.css      all styling
│   ├── games.js        the six mini-games + their lifecycle host
│   ├── site.js         mobile navigation, logo fallback
│   └── logo.png        ← THE OFFICIAL CLUB LOGO GOES HERE
└── README.md
```

## 1. Add the logo

Copy the official club logo file into `assets/` and name it exactly:

```
sustainability-club/assets/logo.png
```

Use the original file as supplied — it is displayed as-is and is never redrawn,
recoloured or re-lettered by the site. It appears in the header, the footer and
as the browser tab icon.

Until that file is added, the header falls back to a plain text wordmark so the
page never shows a broken image. Nothing else depends on it.

## 2. Publish it

**GitHub Pages** — Settings → Pages → *Deploy from a branch*, pick the branch and
the `/ (root)` folder. The site is then at:

```
https://<user>.github.io/<repo>/sustainability-club/
```

To serve it at the root of its own domain instead, publish the *contents* of
this folder as the site root — the page uses only relative paths, so it works at
any depth. It also works from a `file://` path or a USB stick with no server.

**Locally**, from the repository root:

```bash
python3 -m http.server 8099
# → http://127.0.0.1:8099/sustainability-club/
```

## Links used on the page

| What | Where |
| --- | --- |
| WhatsApp group | `https://chat.whatsapp.com/HwxCJThptRb304ezF9hX3E` |
| Membership application | `https://forms.cloud.microsoft/r/Qxs3fnvWgn` |
| Instagram | `@ubt.sustainability` |
| TikTok | `@ubt.sustainability` |
| LinkedIn | `ubt-sustainability-club` |

They appear in the header, hero, the *Get involved* section, the closing band
and the footer. To change one, search `index.html` for the URL and replace every
occurrence.

The application deadline (**19 September 2026**) is written in two places:
the line under the hero buttons and the *Apply to become a member* card.

## The six mini-games

| Game | Type | Length | Win |
| --- | --- | --- | --- |
| Save the Turtle | tapping | ~10s | Turtle reaches safe water |
| Eco Race | racing | ~14s | Cross the line before the rival |
| Bin It | sorting | ~15s | 4 or 5 of 5 sorted right |
| Don't Cook the Planet | button mashing | 5s | Cool Earth to 36° |
| Drop Catch | skill | ~14s | Catch 7 water drops |
| Power UBT | choices | ~10s | Campus score reaches 70 |

Every game runs on a timer or a fixed number of rounds, so none can run forever.
All six work with mouse, trackpad, touch and arrow keys, and end on a **Play
Again / Back to Games** screen.

### How replay stays safe

`assets/games.js` gives each play its own *runtime*, which owns every animation
frame, timer and event listener that game creates. Starting, replaying, closing
or switching games destroys that runtime first, so nothing from a previous play
survives — no stray loops, no stale scores, no leaked listeners. A game can be
played back to back indefinitely without reloading the page. Switching browser
tabs mid-game stops the game and returns to its start screen.

### Editing a game

Each game is one self-contained object in `games.js` with its tuning constants
at the top of `start()` — for example, in *Drop Catch*:

```js
var TIME = 14, NEED = 7, MAX_TRASH = 3;
```

Change those numbers to make a game easier or harder. To change the order of the
cards on the page, edit the `GAMES` array near the bottom of the file.

## Browser support

Tested in current Chrome and Safari engines at desktop (1280×900) and phone
(390×780) sizes. Uses only long-standing web APIs: canvas 2D, pointer events and
`requestAnimationFrame`.
