/**
 * Turns full-resolution originals into the responsive sets the site serves.
 *
 *   npm run images
 *
 * Put originals in  source-images/  (any size, jpg/png/webp/heic).
 * They are written to public/assets/... as WebP + JPEG at several widths,
 * and the components pick the right one per screen via srcset.
 *
 * Originals stay out of the build — only the optimised output ships.
 * Re-run this after replacing any photograph.
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

/** width -> which folder. Hero art needs more widths than a thumbnail. */
const PROFILES = {
  /* The original's own width is always added as the largest step, so these
     are just the smaller rungs of the ladder. */
  'maryam-portrait': { out: 'public/assets/portrait', widths: [800, 1200] },
  'maryam-about': { out: 'public/assets/portrait', widths: [600, 900] },
  default: { out: 'public/assets/portrait', widths: [800, 1200] },
};

const SRC = 'source-images';
if (!existsSync(SRC)) {
  console.log(`No ${SRC}/ directory — nothing to do.`);
  process.exit(0);
}

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
if (files.length === 0) {
  console.log(`No images in ${SRC}/ — nothing to do.`);
  process.exit(0);
}

const kb = (n) => `${Math.round(n / 1024)} KB`;
let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const { name } = parse(file);
  const profile = PROFILES[name] ?? PROFILES.default;
  mkdirSync(profile.out, { recursive: true });

  const input = join(SRC, file);
  totalIn += statSync(input).size;

  const meta = await sharp(input).metadata();
  /* Never upscale, and always ship the original's own width as the largest
     step — so swapping in a differently sized photo needs no config change
     to keep full resolution. */
  const widths = [...new Set([
    ...profile.widths.filter((w) => w < meta.width),
    meta.width,
  ])].sort((a, b) => a - b);

  const made = [];
  for (const w of widths) {
    const isLargest = w === widths[widths.length - 1];
    // The largest JPEG doubles as the plain <img src> fallback.
    const base = isLargest ? name : `${name}-${w}`;

    for (const [ext, opts] of [
      ['webp', { quality: 80, effort: 6 }],
      ['jpg', { quality: 82, progressive: true, mozjpeg: true }],
    ]) {
      const out = join(profile.out, `${base}.${ext}`);
      const pipeline = sharp(input).resize({ width: w, withoutEnlargement: true });
      await (ext === 'webp' ? pipeline.webp(opts) : pipeline.jpeg(opts)).toFile(out);
      totalOut += statSync(out).size;
      made.push(`${base}.${ext} ${kb(statSync(out).size)}`);
    }
  }

  console.log(`${file}  ${meta.width}x${meta.height}  ${kb(statSync(input).size)}`);
  made.forEach((m) => console.log(`   ${m}`));
  console.log(`   -> site.ts widths: [${widths.join(', ')}]`);
}

console.log(`\noriginals ${kb(totalIn)} -> output ${kb(totalOut)}`);
