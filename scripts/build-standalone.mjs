/**
 * Packs the built site into ONE self-contained .html file.
 *
 *   npm run build:standalone   ->  standalone/maryam-imran.html
 *
 * Inlines the JS bundle, the CSS, and the woff2 fonts (as data URIs), so the
 * file opens by double-clicking it and works with no server, no network and
 * no other files beside it. Useful for sharing a preview or archiving a
 * snapshot; the real deployment still uses `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist-standalone';
const OUT_DIR = 'standalone';
const OUT = join(OUT_DIR, 'maryam-imran.html');

const assets = readdirSync(join(DIST, 'assets'));
const jsFile = assets.find((f) => f.endsWith('.js'));
const cssFile = assets.find((f) => f.endsWith('.css'));
if (!jsFile || !cssFile) throw new Error('expected one .js and one .css in the build output');

let css = readFileSync(join(DIST, 'assets', cssFile), 'utf8');
let js = readFileSync(join(DIST, 'assets', jsFile), 'utf8');

/* --- fonts -> data URIs ------------------------------------------------ */
let fontCount = 0;
css = css.replace(/url\(['"]?\/fonts\/([^'")]+)['"]?\)/g, (_m, name) => {
  const b64 = readFileSync(join(DIST, 'fonts', name)).toString('base64');
  fontCount += 1;
  return `url(data:font/woff2;base64,${b64})`;
});

/* Any other absolute asset path would 404 in a single file; none should
   remain, but fail loudly rather than ship a broken page. */
const stray = css.match(/url\(['"]?\/(?!\/)[^'")]+\)/g);
if (stray) throw new Error(`unresolved asset paths in CSS: ${stray.join(', ')}`);

/* --- images -> data URIs ----------------------------------------------
   Photograph paths live in the JS as plain strings (src / fallbackSrc). A
   lone file has no server to resolve them, so each one is swapped for the
   smallest encoding of that image that exists. Missing files are left
   alone — the component already degrades to its stand-in. */
const MIME = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
let inlined = 0;
let inlinedBytes = 0;

// The minifier emits template literals, so backticks count as quotes here.
js = js.replace(/(["'`])(\/assets\/[\w/-]+\.(?:jpe?g|png|webp))\1/g, (whole, _q, path) => {
  // Prefer the WebP sibling: same picture, roughly half the bytes.
  const candidates = [path.replace(/\.[^.]+$/, '.webp'), path];
  for (const candidate of candidates) {
    const file = join(DIST, candidate.replace(/^\//, ''));
    if (!existsSync(file)) continue;
    const ext = candidate.split('.').pop();
    const buf = readFileSync(file);
    inlined += 1;
    inlinedBytes += buf.length;
    return `"data:${MIME[ext]};base64,${buf.toString('base64')}"`;
  }
  return whole;
});

/* --- assemble ----------------------------------------------------------
   No <!doctype>, <html>, <head> or <body>: this file is designed to be
   dropped straight into a page skeleton, and browsers render it as-is. */
const html = `<title>Maryam Imran</title>
<meta name="description" content="Business Analytics & Information Systems student in Jeddah working across business, technology and impact." />
<style>
${css}
</style>

<div id="root"></div>

<script type="module">
${js}
</script>
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, html);

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(
  `${OUT}  ${kb(Buffer.byteLength(html))}  ` +
    `(${fontCount} fonts, ${inlined} image${inlined === 1 ? '' : 's'} ${kb(inlinedBytes)} inlined)`,
);
