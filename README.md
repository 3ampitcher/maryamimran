# mayamirman.com

Personal platform for Maryam Imran — **Business × Technology × Impact**.

Built with Vite, React and TypeScript. Static output, no backend, no CMS.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in /dist
npm run preview    # serve the built site locally
npm run typecheck  # TypeScript only

npm run build:standalone   # -> standalone/maryam-imran.html
```

`build:standalone` packs the whole site into **one self-contained .html file** —
JS, CSS and fonts all inlined. Double-click it and it opens; no server, no
network, no other files needed. Handy for sending someone a preview or keeping
a snapshot. It routes on the URL hash (`#/business`) since there's no server to
rewrite paths; the real deployment still uses `npm run build`.

Deploying: `npm run build` and publish `/dist`. SPA rewrites are already
configured for Vercel (`vercel.json`) and Netlify (`public/_redirects`).
Point `mayamirman.com` at the host and nothing in the code needs to change.

---

## Where things live

```
src/
  data/            ← all content. Edit here, not in components.
    work.ts          every project, role, competition and talk
    writing.ts       writing pieces
    programs.ts      "Places I've learned"
    recognition.ts   education + awards
    site.ts          name, links, resume, Now, LEAP toggle
    types.ts         the shape of a work item
  components/      ← one folder per section, .tsx + .css together
  pages/           ← one file per route
  hooks/           ← reduced motion, media queries, in-view, nav ground
  styles/
    tokens.css       colour, type scale, spacing, motion
    globals.css      reset, layout primitives, utilities
    fonts.css        self-hosted @font-face declarations
public/
  assets/          ← images (see assets/README.md)
  fonts/           ← self-hosted woff2
  resume/          ← the PDF (see resume/README.md)
```

---

## The one rule

**Every project is written once, in `src/data/work.ts`.**

The Work Hub, the three category pages, Speaking, Recognition and the Index all
read from that same array. Nothing is duplicated in a component. To add a
project, append one object; it appears everywhere it belongs automatically.

```ts
{
  id: 'thing',
  title: 'Thing',
  year: '2026',
  yearSort: 2026,
  role: 'Founder',
  primaryCategory: 'business',        // business | technology | impact
  secondaryTags: ['build', 'lead'],   // drives the Index filters
  shortDescription: '...',            // one line, used in previews
  fullDescription: ['...'],           // paragraphs, in the expanded record
  contribution: ['...'],              // "What I did" bullets
  showInIndex: true,
  showInSpeaking: false,              // adds it to the Speaking gallery
  showInRecognition: false,
  order: 9,
}
```

### Metrics are opt-in

A metric only renders when `verified: true`. Unverified figures stay in the
data as a reminder and are never shown:

```ts
metrics: [
  { value: 'SAR 30,000', label: 'Approximate revenue', verified: false },  // hidden
  { value: '8',          label: 'Days',                verified: true  },  // shown
]
```

Same for `recognition.ts` — `publishedRecognition` filters to verified entries
before anything reaches the page.

---

## Replacing content

| What | Where |
|---|---|
| Projects, roles, competitions, talks | `src/data/work.ts` |
| Writing pieces + their links | `src/data/writing.ts` |
| Programs and what you did there | `src/data/programs.ts` |
| Education, awards, grades | `src/data/recognition.ts` |
| Email, LinkedIn, Substack | `src/data/site.ts` → `site.links` |
| The LEAP line in Contact | `src/data/site.ts` → `leapMode` (set `false` after LEAP) and `leapLine` |
| Hero portrait treatment | `src/data/site.ts` → `portrait.cutout` |
| Page titles and meta descriptions | each file in `src/pages/` |

## Replacing images

Drop files into `public/assets/<category>/` at the paths listed in
`public/assets/README.md`. Until a file exists, an editorial placeholder with
the project's real name renders instead — no stock photography, ever.

The two portraits go in `public/assets/portrait/`:
`maryam-portrait.png` (hero) and `maryam-about.jpg` (About).

The hero supports two treatments, switched by `portrait.cutout` in `site.ts`:

- **`cutout: true`** (current) — a transparent PNG with the background removed,
  placed straight onto the stone so the figure overlaps the giant name. This is
  the integrated composition.
- **`cutout: false`** — a normal rectangular photo. Its lower edge is masked so
  it dissolves into the ground rather than reading as a photo card.

## Adding the resume

Put `Maryam-Imran-Resume.pdf` in `public/resume/`, then set
`resume.available: true` in `src/data/site.ts`. That turns on the Resume link
in the navigation, the mobile menu, About and Contact at once. While it's
`false`, those links aren't rendered, so there's never a link that 404s.

---

## Design system

**Stone / Ink / Cobalt.** Roughly 90% neutrals, 10% cobalt. Cobalt marks active
state, current navigation, arrows, filters and small emphasis — nothing else.

```
--stone  #D7D9D6      --ink    #181A1D      --cobalt #3155D9
--paper  #F4F2ED      --white  #F7F7F4      --muted  #8B8F8C
```

`--muted` is a palette colour, not a text colour: at label sizes it measures
2.9:1 on paper. Small type uses `--text-tertiary`, a darker step that clears
4.5:1 on both paper and stone. Sections tagged `.ground-stone` deepen cobalt
slightly for the same reason; `.surface-dark` flips the whole scale for ink.

**Type.** Inter Tight throughout, IBM Plex Mono for micro-labels and years,
and one italic Newsreader serif used exactly once — the pull-quote in Writing.
All three are self-hosted from `public/fonts` (SIL Open Font Licence), so there
is no render-blocking third-party request.

**Motion** is a small fixed vocabulary: mask reveal, image scale 1.04→1.00,
sticky stack, hover preview, expand/collapse. Reveals are an
IntersectionObserver plus a CSS transition. Everything collapses to a complete
static composition under `prefers-reduced-motion: reduce`.

Each category deliberately has its own interaction model:

| | Model |
|---|---|
| **Business** | interactive index — rows expand in place, hover raises a preview |
| **Technology** | irregular grid on a 12-column ground — a lab, not a card wall |
| **Impact** | sticky chapters that stack as you scroll |

## Page structure

The homepage is deliberately short: **hero → intro → business / technology /
impact → speaking → contact**. Everything else is still on the site, one level
in:

| Content | Lives on |
|---|---|
| Writing | `/writing` |
| Education, recognition, programs, resume | `/about` |
| The full archive | `/index` |

`/index` opens on a table of contents — seven groups with counts — and renders
records grouped under their own headings rather than as one flat list. Speaking
is a lens rather than a partition: a talk is still Technology work and appears
in both places, so the row total (51) is higher than the distinct record count
(44), which is the number the page reports.

---

## Notes

- The Index (`/index`) is the permanent archive. Filtering and search are
  client-side against the in-memory array — no reloads, no network.
- Don't invent metrics, dates, partnerships or outcomes. If something isn't
  confirmed, leave the field out or mark it `verified: false`.
- Open TODOs are marked `TODO(maryam)` in the data files only — never in the UI.

---

## Also in this repository: `founder-code/`

`/founder-code` is a **separate site for a separate brand** — Founder Code, a
company of The Founder & Co. It shares nothing with the personal platform except
the repository and the three self-hosted typefaces: no shared tokens, no shared
components, no shared routing.

It is plain HTML, CSS and JavaScript with no build step and no dependencies, so
it is untouched by `npm run build` and deploys independently (its own host, its
own domain). See `founder-code/README.md`.
