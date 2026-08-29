/* Static sanity check for the Founder Code site.
   Run with: node check.mjs   (from inside founder-code/)
   No dependencies — it reads the HTML as text, which is enough to catch
   the things that actually break a hand-authored static site: dead
   internal links, dead fragments, duplicate ids, and missing assets. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const pages = readdirSync('.').filter((f) => f.endsWith('.html'));
const problems = [];
const idsByPage = new Map();

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) problems.push(`${page}: duplicate id "${id}"`);
    seen.add(id);
  }
  idsByPage.set(page, seen);
}

for (const page of pages) {
  const html = readFileSync(page, 'utf8');

  // Every referenced local file must exist.
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#|data:)/.test(url)) continue;
    const [path] = url.split('#');
    if (!path) continue;
    if (!existsSync(path)) problems.push(`${page}: missing file "${path}"`);
  }

  // Every fragment must resolve, on this page or the page it points at.
  for (const [, url] of html.matchAll(/href="([^"]*#[^"]+)"/g)) {
    const [path, frag] = url.split('#');
    const target = path === '' ? page : path;
    if (!pages.includes(target)) continue;
    const ids = idsByPage.get(target);
    if (!ids.has(frag)) problems.push(`${page}: dead fragment "#${frag}" on ${target}`);
  }

  // aria-controls and aria-labelledby must point at something real.
  for (const [, attr, value] of html.matchAll(/(aria-controls|aria-labelledby)="([^"]+)"/g)) {
    for (const ref of value.split(/\s+/)) {
      if (!idsByPage.get(page).has(ref)) problems.push(`${page}: ${attr}="${ref}" has no matching id`);
    }
  }

  // Crude tag balance check for the elements that carry the layout.
  for (const tag of ['section', 'main', 'article', 'footer', 'header']) {
    const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) problems.push(`${page}: <${tag}> ${open} open vs ${close} close`);
  }

  for (const required of ['<title>', 'name="description"', 'assets/css/founder-code.css', 'skip-link']) {
    if (!html.includes(required)) problems.push(`${page}: missing ${required}`);
  }
}

// Style records referenced by the pages must exist in the data file.
const data = readFileSync('assets/js/styles-data.js', 'utf8');
for (const code of ['VOM', 'VOR', 'VIM', 'VIR', 'GOM', 'GOR', 'GIM', 'GIR']) {
  if (!data.includes(`${code}: {`)) problems.push(`styles-data.js: missing style ${code}`);
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n` + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`OK — ${pages.length} pages, no dead links, fragments, ids or assets.`);
