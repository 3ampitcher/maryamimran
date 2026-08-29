# Source images

Full-resolution originals live here. They are **not** committed and **not**
shipped — `npm run images` turns them into the optimised WebP + JPEG sets in
`public/assets/`, and only those are served.

    source-images/maryam-portrait.png   ->  public/assets/portrait/maryam-portrait{,-1200,-800}.{webp,jpg}

To replace a photograph: drop the new original in here under the same name,
run `npm run images`, and commit the regenerated files in `public/assets/`.

Widths per image are configured in `scripts/optimize-images.mjs`; the list in
`src/data/site.ts` → `portrait.widths` must match.
