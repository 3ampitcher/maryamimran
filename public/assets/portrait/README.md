# Portrait assets

Drop two files here. Nothing else in the codebase needs to change.

| File | Used by | Notes |
|---|---|---|
| `maryam-portrait.jpg` | Hero (home page) | The main portrait. Square works best — the hero frame crops taller and keeps the face in the upper third via `object-position`. Export at ~1600px on the long edge. |
| `maryam-about.jpg` | About page | A second, more candid image. Optional — if it's absent the About page falls back to the hero portrait automatically. |

Until a file exists at these paths, an editorial monogram placeholder renders in its
place. Nothing breaks and nothing ugly appears on the live UI.

Paths are configured in `src/components/Portrait/Portrait.tsx`.
