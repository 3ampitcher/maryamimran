/* ============================================================
   POSTER RENDERER
   ------------------------------------------------------------
   Renders the three marketing posters to PNG at 2x.

     npm i --no-save playwright
     node marketing/render.mjs [outDir] [onlySlug]

   It serves the founder-code directory over HTTP first — the
   posters load the site's own stylesheet and self-hosted fonts,
   and a browser refuses cross-origin font requests over file://.

   The renderer fails loudly if a poster's content exceeds the
   canvas, because a silently clipped poster is worse than none.
   ============================================================ */

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

/* Canvas per poster. 01 and 02 are 4:5 portrait; 03 is the landscape
   dashboard. Change a pair here and in the matching stylesheet. */
const SCALE = 2;

const OUT = process.argv[2] || 'marketing/exports';
const only = process.argv[3];
const ROOT = process.cwd();
const PORT = 8767;

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2'
};

const server = createServer(async (req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(req.url.split('?')[0])));
  if (!path.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
const POSTERS = [
  ['01-why', 'founder-code-01-why', 1600, 2000],
  ['02-how', 'founder-code-02-how-it-works', 1600, 2000],
  ['03-dashboard', 'founder-code-03-dashboard', 2000, 1130]
].filter(([src]) => !only || src === only);

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
);
const ctx = await browser.newContext({
  viewport: { width: 2100, height: 2100 },
  deviceScaleFactor: SCALE,
  reducedMotion: 'reduce'
});
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });

for (const [src, name, W, H] of POSTERS) {
  await page.setViewportSize({ width: W + 80, height: Math.min(H + 80, 2100) });
  await page.goto(`http://127.0.0.1:${PORT}/marketing/${src}.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  const box = await page.evaluate(() => {
    const p = document.getElementById('poster');
    return { w: p.offsetWidth, h: p.offsetHeight, sh: p.scrollHeight, sw: p.scrollWidth };
  });
  if (box.w !== W || box.h !== H) errs.push(`${src}: canvas is ${box.w}x${box.h}, expected ${W}x${H}`);
  if (box.sw > box.w + 1) errs.push(`${src}: content overflows canvas by ${box.sw - box.w}px horizontally`);
  if (box.sh > box.h + 1) errs.push(`${src}: content overflows canvas by ${box.sh - box.h}px`);
  await page.locator('#poster').screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${name}.png  ${box.w}x${box.h} css -> ${box.w * SCALE}x${box.h * SCALE} px${box.sh > box.h + 1 ? '  OVERFLOW ' + (box.sh - box.h) : ''}`);
}
await browser.close();
server.close();
if (errs.length) { console.error('PROBLEMS:\n' + errs.join('\n')); process.exit(1); }
console.log('clean');
