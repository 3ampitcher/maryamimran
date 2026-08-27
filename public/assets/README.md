# Image assets

Drop real photographs and screenshots here. Nothing else needs to change —
each work item in `src/data/work.ts` already points at the paths below.

Until a file exists at a path, a neutral placeholder carrying the project's
real name renders in its place. There is no stock photography anywhere in this
project and none should be added.

## Where each folder is used

| Folder | Used by |
|---|---|
| `portrait/` | Hero and About portraits — see `portrait/README.md` |
| `business/` | Business work items (Tiin, Food Gala, marketing) |
| `technology/` | Technology work items (VITA, prototyping, decks) |
| `impact/` | Impact chapters (club, Think Sustainability, GreenMetric) |
| `speaking/` | Speaking gallery (Demo Day, Agentic AI, Engineering Day) |
| `writing/` | Reserved — Writing is typographic and uses no images today |

## Paths the data currently expects

Business
- `business/tiin-product.jpg`, `business/tiin-deck.jpg`,
  `business/tiin-accelerator.jpg`, `business/tiin-discovery.jpg`
- `business/food-gala-1.jpg`, `business/food-gala-2.jpg`
- `business/brandstorm.jpg`, `business/silent-kitchen.jpg`

Technology
- `technology/vita-prototype.jpg`, `technology/vita-components.jpg`,
  `technology/vita-lab.jpg`, `technology/vita-team.jpg`
- `technology/agentic-ai-deck.jpg`, `technology/tks.jpg`
- `technology/prototyping-1.jpg`, `technology/prototyping-2.jpg`

Impact
- `impact/club-team.jpg`, `impact/club-event.jpg`
- `impact/think-sustainability-1.jpg`, `impact/think-sustainability-booths.jpg`,
  `impact/think-sustainability-plan.jpg`, `impact/think-sustainability-team.jpg`
- `impact/greenmetric-data.jpg`, `impact/campus.jpg`, `impact/literacy-survey.jpg`

Speaking
- `speaking/demo-day-stage.jpg`, `speaking/agentic-ai-session.jpg`,
  `speaking/engineering-day.jpg`

Social preview
- `og-image.jpg` — 1200×630, referenced by the Open Graph tags in `index.html`

## Sizing

Export at roughly 1600–2000px on the long edge and compress. Images are lazy
loaded below the fold and carry `sizes` hints, so they don't need to be huge.
Every image needs `alt` text — it lives beside the path in `work.ts`.
