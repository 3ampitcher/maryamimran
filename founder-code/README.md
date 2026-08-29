# Founder Code

Website for **Founder Code**, a company of The Founder & Co.

> Founder Code = Founder Quotient + Founder Hunter — the intelligence layer for
> founder decisions in the venture ecosystem.

Plain HTML, CSS and JavaScript. **No build step, no dependencies, no backend.**
Open `index.html` in a browser and it works; upload the folder to any static
host and it works there too.

---

## Running it

```bash
# From this directory
python3 -m http.server 8000     # then open http://localhost:8000
```

You can also just double-click `index.html`. The only difference is that
browsers block `file://` webfont requests under CORS, so the type falls back to
system fonts. Everything else — the Style Finder, the calculator, the axis
picker — behaves identically.

Deploying: publish this folder. There is nothing to compile.

```bash
node check.mjs           # dead links, dead fragments, duplicate ids, missing assets
node build-single.mjs    # -> dist/founder-code.html
```

`build-single.mjs` packs all eight pages, the stylesheet, the scripts and the
webfonts into **one self-contained .html file** — around 430 KB, no server, no
network, no other files. Double-click it and the whole site opens. Handy for
sending someone a preview or keeping a snapshot. Because every page shares one
document it routes on the hash (`#/founder-quotient`,
`#/founder-styles/style-inventor`), via the `FC_HASH_PREFIX` and `FC_LINK` seams
in `style-finder.js`. `--fragment` emits the same bundle without the
`<html>`/`<head>`/`<body>` wrapper, for hosts that supply their own.

The real deployment is still the eight plain files; the bundle is an output, not
the source of truth.

---

## The pages

| Page | What it does |
|---|---|
| `index.html` | The argument. IQ / EQ / FQ, the two capabilities, the six dimensions, the score, the eight styles, the deliverable, who it is for, the evidence. |
| `founder-quotient.html` | The assessment in depth, with an interactive weighting of the three scored components. |
| `founder-hunter.html` | Search, assess, match — plus the founder intelligence flywheel and the MENAP founder map. |
| `founder-styles.html` | The three axes, an interactive axis picker, and all eight styles in full. |
| `style-finder.html` | The free, indicative 24-item instrument. Runs entirely in the browser. |
| `sample-report.html` | The illustrative Executive Intelligence Dashboard. |
| `evidence.html` | Research base, practitioner base, assessment governance, methodological position. |
| `contact.html` | Enquiry form (composes a `mailto:`) and what happens next. |

---

## The style system

The eight founder styles are the eight combinations of three binary preference
axes, and the three-letter marker is the same one the Founder Intelligence
Profile prints:

| Axis | Pole A | Pole B |
|---|---|---|
| **Horizon** — what pulls attention | **V** Vision | **G** Ground |
| **Arena** — where value gets created | **O** Outward | **I** Inward |
| **Mode** — how decisions get made | **M** Momentum | **R** Rigour |

```
VOM Pioneer     VOR Navigator    VIM Inventor     VIR Strategist
GOM Rainmaker   GOR Diplomat     GIM Scaler       GIR Operator
```

All style copy lives in one place: `assets/js/styles-data.js`. The axis picker
and the Style Finder read it at runtime; the eight full entries in
`founder-styles.html` were generated from it, so edit the data file and
regenerate rather than editing the two by hand.

### The Style Finder

24 statements, eight per axis, **four loading on each pole** — so someone who
agrees with everything lands in the middle rather than at Vision / Outward /
Momentum. Responses run −3 to +3; each axis total is normalised to a percentage
toward its poles.

It is deliberately not the Founder Quotient, and every screen says so: it is
self-report only, it produces no score, and style contributes no points to FQ.
Results are encoded in the URL hash (`#style=VIM&h=63&a=46&m=63`) so a result
can be reopened or shared without anything being stored on a server. Partial
progress is kept in `localStorage`, inside `try`/`catch`, so blocked storage
degrades to "no resume offered" rather than to an error.

---

## Where things live

```
founder-code/
  *.html                    one file per page, hand-authored, no templating
  assets/
    css/founder-code.css    the whole design system — tokens first
    css/fonts.css           self-hosted @font-face declarations
    js/site.js              nav, reveal, charts, accordions, tabs, calculator,
                            axis picker, print, enquiry form
    js/styles-data.js       the eight styles and the three axes
    js/style-finder.js      the indicative instrument
    fonts/                  Inter Tight, IBM Plex Mono, Newsreader (SIL OFL)
    img/mark.svg            the brand mark
  check.mjs                 static sanity check
  favicon.svg  robots.txt  sitemap.xml
```

---

## Design notes

**Palette.** Deep teal on paper, near-black for the passages that carry weight.
Amber marks data and watch areas; coral marks risk. Every colour and typeface
is declared once, in `:root` at the top of `founder-code.css` — swapping the six
palette values and the three font stacks re-skins the whole site.

**Type.** Inter Tight for display and interface, IBM Plex Mono wherever the
product is literal (scores, axis markers, dimension numbers), one italic
Newsreader for the two pull quotes.

**Degradation.** Content is visible by default; JavaScript adds `.reveal-ready`
immediately before wiring the reveal observer, so a script error can never blank
the page. Without JavaScript the navigation stays in flow instead of becoming an
overlay, the first accordion panel is open, and the first tab panel is shown.

**Accessibility.** Every bar prints its own number in text and carries an
`aria-label`; the scale is a keyboard-operable radiogroup; tabs use roving
focus; reduced motion is respected everywhere; text steps were chosen against
the paper and ink grounds rather than picked for looks.

---

## Three things to set before launch

1. **Contact address.** `hello@foundercode.co` is a placeholder. It appears in
   `contact.html` and in the `ADDRESS` constant near the end of
   `assets/js/site.js`.
2. **Canonical domain.** `https://foundercode.co/` is assumed by the `canonical`
   and `og:url` tags in every page, plus `sitemap.xml` and `robots.txt`.
3. **Parent-brand assets.** `thefounderand.co` was unreachable from the
   environment this was built in, so the family relationship is expressed
   structurally — the "a company of The Founder & Co" lockup in the masthead and
   footer, and a restrained professional-services register — rather than by
   matching the parent's exact palette and type. When the real brand assets are
   available, the `:root` block is the only place that needs to change.

## One thing to check before publishing

The illustrative dashboard uses **"Sample Founder"** rather than a real name,
and states on the page that every figure is fictional. If a named illustrative
founder is wanted instead, that is a deliberate decision to make — invented
assessment scores attached to a real person read very differently once the page
is shared onward.
