# Founder Code — marketing posters

Three branded visuals, authored as HTML and rendered to PNG. They inherit the
site's tokens wholesale (`../assets/css/founder-code.css`), so the marketing set
and the product cannot drift apart — change a brand colour once, in `:root`, and
all three posters follow.

| File | Poster |
|---|---|
| `01-why.html` | **Why / big picture** — the problem IQ and EQ leave, the FQ + Hunter lockup, who uses it, the value, the evidence base. Ink ground. |
| `02-how.html` | **How it works** — assessment inputs, the three-part weighted score, the six FQ dimensions, the three axes and eight styles. |
| `03-dashboard.html` | **Executive Intelligence Dashboard** — the four-column landscape dashboard, in the Founder Code palette and typefaces. **Generated**: edit `03-dashboard.build.mjs` and re-run it, never the HTML. |

## Rendering

```bash
npm i --no-save playwright          # from the repository root
node marketing/render.mjs           # -> marketing/exports/*.png
node marketing/render.mjs out 02-how   # one poster, custom directory
```

The renderer serves this directory over HTTP itself — the posters load the
site's stylesheet and self-hosted fonts, and browsers refuse cross-origin font
requests over `file://`. Set `CHROME_PATH` to use a Chromium you already have.

It **fails loudly if a poster's content exceeds the canvas**, because a silently
clipped poster is worse than no poster. If you add copy and the render errors,
either cut the copy or take the space from a band's padding.

## Format

| Poster | Canvas | Export |
|---|---|---|
| 01, 02 | 1600 × 2000 (4:5 portrait) | 3200 × 4000 |
| 03 | 2000 × 1130 (landscape) | 4000 × 2260 |

Sizes live in the `POSTERS` table in `render.mjs`, paired with the `.poster`
width/height in `poster.css` (01, 02) and `.dash-poster` in `dashboard.css`
(03). Change a pair and the bands reflow; expect to re-tune padding, and the
renderer will tell you if anything no longer fits.

## Editing copy

Posters 01 and 02 are hand-authored and deliberately literal — no templating, so
what you read is what renders. Structural pieces (`.band`, `.box`, `.maths`,
`.lockup`) live in `poster.css`; everything else is a site component (`.meter`,
`.pill`, `.points`, `.kv`, `.ladder`, `.axis`) reused as-is.

Poster 03 is generated. Its layout and content are fixed by the supplied
design — only the palette and the two typefaces are Founder Code's. Colour roles
are mapped once, at the top of `dashboard.css`: brand teal for structure and
strong signals, amber for evidence and moderate levels, coral for risk and watch
areas only, ink for neutral weight.

The illustrative dashboard uses **"Sample Founder"** and states on the poster
that every figure is fictional. Swapping in a real name attaches invented
assessment scores to a real person — a deliberate decision, not a detail.
