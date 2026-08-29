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

/* Portraits get their own responsive ladder because the hero serves them at
   viewport width. Everything else is a project image inside a layout, so one
   optimised pair is enough. */
const PORTRAIT_PROFILES = {
  'maryam-portrait': { out: 'public/assets/portrait', widths: [800, 1200] },
  'maryam-about': { out: 'public/assets/portrait', widths: [600, 900] },
};

/* Project images are routed by filename prefix, so dropping in
   `business-tiin-product.png` writes public/assets/business/tiin-product.*
   — the exact path work.ts already points at. */
const SECTIONS = ['business', 'technology', 'impact', 'speaking', 'writing'];
const PROJECT_WIDTH = 1600;

function route(name) {
  if (PORTRAIT_PROFILES[name]) return { kind: 'portrait', ...PORTRAIT_PROFILES[name], base: name };
  const section = SECTIONS.find((s) => name.startsWith(`${s}-`));
  if (section) {
    return {
      kind: 'project',
      out: `public/assets/${section}`,
      base: name.slice(section.length + 1),
      widths: [PROJECT_WIDTH],
    };
  }
  return null;
}

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
const skipped = [];

for (const file of files) {
  const { name } = parse(file);
  const profile = route(name);
  if (!profile) {
    skipped.push(file);
    continue;
  }
  mkdirSync(profile.out, { recursive: true });

  const input = join(SRC, file);
  totalIn += statSync(input).size;

  const meta = await sharp(input).metadata();
  /* Portraits keep the original's own width as the largest step — the hero
     serves them at viewport width, so full resolution matters and swapping in
     a differently sized photo needs no config change. Project images sit
     inside a layout and are capped at their configured width instead. */
  const widths = [...new Set(
    profile.kind === 'portrait'
      ? [...profile.widths.filter((w) => w < meta.width), meta.width]
      : profile.widths.map((w) => Math.min(w, meta.width)),
  )].sort((a, b) => a - b);

  const made = [];
  for (const w of widths) {
    const isLargest = w === widths[widths.length - 1];
    // The largest JPEG doubles as the plain <img src> fallback.
    const base = isLargest ? profile.base : `${profile.base}-${w}`;

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
  if (profile.kind === 'portrait') {
    console.log(`   -> site.ts portrait.widths: [${widths.join(', ')}]`);
  }
}

console.log(`\noriginals ${kb(totalIn)} -> output ${kb(totalOut)}`);

if (skipped.length) {
  console.log(`\nSkipped — no route for these names:`);
  skipped.forEach((f) => console.log(`   ${f}`));
  console.log(
    `   Prefix a project image with its section (${SECTIONS.join(', ')}),\n` +
      `   e.g. business-tiin-product.png -> public/assets/business/tiin-product.jpg`,
  );
}
