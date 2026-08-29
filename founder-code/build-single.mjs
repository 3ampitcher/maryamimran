/* ============================================================
   SINGLE-FILE BUILD
   ------------------------------------------------------------
   Packs all eight pages, the stylesheet, the scripts and the
   webfonts into one self-contained .html file. Double-click it
   and the whole site opens — no server, no network, no other
   files. Useful for sending someone a preview, and for keeping
   a snapshot of what the site looked like on a given day.

     node build-single.mjs                  -> dist/founder-code.html
     node build-single.mjs --fragment       -> dist/founder-code.fragment.html
                                               (no <html>/<head>/<body>, for
                                               hosts that supply their own)

   Because every page shares one document, the build routes on the
   hash: #/founder-quotient, #/founder-styles/style-inventor. The
   Style Finder writes its result behind the same prefix, via the
   FC_HASH_PREFIX and FC_LINK seams in style-finder.js.

   The real deployment is the eight plain files; this is a bundle,
   not the source of truth.
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const FRAGMENT = process.argv.includes('--fragment');

const PAGES = [
  ['index', 'Founder Code'],
  ['founder-quotient', 'Founder Quotient'],
  ['founder-hunter', 'Founder Hunter'],
  ['founder-styles', 'The Eight Styles'],
  ['style-finder', 'Founder Style Finder'],
  ['sample-report', 'Sample Report'],
  ['evidence', 'Evidence'],
  ['contact', 'Contact']
];

const read = (p) => readFileSync(p, 'utf8');
const between = (s, a, b) => s.slice(s.indexOf(a) + a.length, s.indexOf(b));

/* --- Fonts: latin subsets only, inlined ---------------------------------
   The latin-ext faces are dropped from the bundle. They exist on the real
   site, where they cost nothing until a character needs them; here they
   would be a third of the file for copy that is entirely latin. */
const face = (family, style, weight, file) =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;` +
  `src:url(data:font/woff2;base64,${readFileSync(`assets/fonts/${file}`).toString('base64')}) format('woff2')}`;

const fonts = [
  face('Inter Tight', 'normal', '400 600', 'inter-tight-latin.woff2'),
  face('IBM Plex Mono', 'normal', '400', 'ibm-plex-mono-400-latin.woff2'),
  face('IBM Plex Mono', 'normal', '500', 'ibm-plex-mono-500-latin.woff2'),
  face('Newsreader', 'italic', '300', 'newsreader-italic-latin.woff2')
].join('\n');

const css = read('assets/css/founder-code.css').replace(/@import url\('fonts\.css'\);/, '');

/* --- Rewrite cross-page links onto the hash router ---------------------- */
const slugs = PAGES.map(([slug]) => slug);
function rewrite(html) {
  return html.replace(/href="([a-z-]+)\.html(#([\w-]+))?"/g, (whole, slug, _h, frag) => {
    if (!slugs.includes(slug)) return whole;
    return `href="#/${slug}${frag ? '/' + frag : ''}"`;
  });
}

/* --- Assemble ----------------------------------------------------------- */
const source = Object.fromEntries(PAGES.map(([slug]) => [slug, read(`${slug}.html`)]));

const masthead = rewrite(between(source.index, '<header class="masthead">', '</header>'));
const footer = rewrite(between(source.index, '<footer class="footer on-ink">', '</footer>'));

const views = PAGES.map(([slug]) => {
  const main = rewrite(between(source[slug], '<main id="main">', '</main>'));
  return `<div class="fcpage" id="page-${slug}" hidden>\n${main}\n</div>`;
}).join('\n');

const router = `
/* Hash router for the single-file build. A hash that does not start with
   "/" is left alone, so ordinary in-page anchors still scroll natively. */
window.FC_HASH_PREFIX = '/style-finder&';
window.FC_LINK = function (page, frag) { return '#/' + page + (frag ? '/' + frag : ''); };
(function () {
  var SLUGS = ${JSON.stringify(slugs)};
  var TITLES = ${JSON.stringify(Object.fromEntries(PAGES))};
  var BASE = ${JSON.stringify(read('index.html').match(/<title>([^<]*)<\/title>/)[1])};

  function apply() {
    var hash = location.hash.replace(/^#/, '');
    var match = hash.match(/^\\/([a-z-]+)(?:\\/([\\w-]+))?/);
    var slug = match && SLUGS.indexOf(match[1]) >= 0 ? match[1] : 'index';

    SLUGS.forEach(function (s) {
      document.getElementById('page-' + s).hidden = s !== slug;
    });

    document.title = slug === 'index' ? BASE : TITLES[slug] + ' — Founder Code';

    document.querySelectorAll('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === '#/' + slug) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    var frag = match && match[2] ? document.getElementById(match[2]) : null;
    if (frag) frag.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', apply);
  apply();
})();
`;

const scripts = [
  read('assets/js/styles-data.js'),
  router,
  read('assets/js/site.js'),
  read('assets/js/style-finder.js')
].join('\n;\n');

const head = `<title>Founder Code</title>
<style>
${fonts}
${css}
/* The bundle stacks all eight pages in one document. */
.fcpage[hidden] { display: none; }
</style>`;

const body = `<a class="skip-link" href="#main">Skip to content</a>
${masthead}
<main id="main">
${views}
</main>
${footer}
<script>
${scripts}
</script>`;

mkdirSync('dist', { recursive: true });

if (FRAGMENT) {
  writeFileSync('dist/founder-code.fragment.html', head + '\n' + body + '\n');
} else {
  writeFileSync(
    'dist/founder-code.html',
    `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0c1014">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${readFileSync('assets/img/mark.svg').toString('base64')}">
<meta name="description" content="${
      read('index.html').match(/name="description" content="([^"]*)"/)[1]
    }">
${head}
</head>
<body>
${body}
</body>
</html>
`
  );
}

console.log('built', FRAGMENT ? 'dist/founder-code.fragment.html' : 'dist/founder-code.html');
