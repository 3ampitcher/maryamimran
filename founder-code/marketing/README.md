# Founder Code — marketing posters

Three branded visuals, authored as HTML and rendered to PNG. They inherit the
site's tokens wholesale (`../assets/css/founder-code.css`), so the marketing set
and the product cannot drift apart — change a brand colour once, in `:root`, and
all three posters follow.

| File | Poster |
|---|---|
| `01-why.html` | **Why / big picture** — the problem IQ and EQ leave, the FQ + Hunter lockup, who uses it, the value, the evidence base. Ink ground. |
| `02-how.html` | **How it works** — assessment inputs, the three-part weighted score, the six FQ dimensions, the three axes and eight styles. |
| `03-dashboard.html` | **What the client receives** — the Executive Intelligence Dashboard as the tangible output, clearly labelled illustrative. |

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

Canvas is **1600 × 2000 CSS px (4:5)**, rendered at 2× to **3200 × 4000 PNG** —
right for LinkedIn, a PDF one-pager, or printing at roughly A4.

To change format, edit `W` and `H` in `render.mjs` and the matching `.poster`
width/height in `poster.css`. The bands reflow; expect to re-tune padding, and
the renderer will tell you if anything no longer fits.

## Editing copy

Poster HTML is hand-authored and deliberately literal — no templating, so what
you read is what renders. Structural pieces (`.band`, `.box`, `.maths`,
`.mini`, `.lockup`) live in `poster.css`; everything else is a site component
(`.meter`, `.pill`, `.points`, `.kv`, `.ladder`, `.axis`, `.gauge`) reused as-is.

The illustrative dashboard uses **"Sample Founder"** and states on the poster
that every figure is fictional. Swapping in a real name attaches invented
assessment scores to a real person — a deliberate decision, not a detail.
