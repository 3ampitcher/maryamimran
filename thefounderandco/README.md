# TheFounder&Co.

Two static pages plus a 404, one brand system. No build step, no
dependencies — open the files or drop the folder on any static host.

    index.html      the solver: the interactive "what do we actually need"
                    tool. Every outcome resolves to one of the seven
                    services below.
    company.html    the long-scroll site: why we exist, the services, the
                    stage map, the routing tree, who is behind it, proof,
                    contact.
    privacy.html    what the site collects and what it doesn't
    404.html        not-found page
    sitemap.xml     two URLs
    robots.txt      allows everything, points at the sitemap
    _redirects      Netlify 404 rule
    vercel.json     Vercel config and asset caching
    assets/
      brand.css     colour, type, nav, footer, motion. Shared by all pages.
      site.js       the SITE config, scroll progress, scroll reveals.
      og-*.png      1200x630 social preview cards
      imran-yousuf.jpg
      README.md     where to put the portrait and logo files.

## The seven services

Three groups. Rename one in a single place and every page follows.

    Founder Code    Founder Quotient · Founder Hunter · Founder Inner Circle
    Leadership      Executive Search · Executive On-Demand
    Engine          TA Powerhouse · Tech Grid

The solver has eighteen possible endings; each maps to one of these seven
via `SERVICES` and `NAMES` at the top of the script in `index.html`. The
company page reads the same names from `SERVICES` at the top of its own
script. Change a name in both constants and the two pages stay in step.

## Changing things

**Contact details** — `assets/site.js`, the `SITE` object at the top.
Every contact link on every page is generated from it.

**Where the solver emails go** — `SITE.formEndpoint` (and `SITE.formKey`
for Web3Forms). The comment above them in `assets/site.js` has the exact
steps. Until one is set the form opens a prefilled email instead, so it
works either way, but nothing reaches you unless the visitor sends it.

**Brand colour / type** — `assets/brand.css`, the `:root` block. The three
greys (`--muted`, `--faint`, `--soft`) are set at the lightest values that
still clear WCAG AA on the page background. Lighten them and small text
starts failing.

**Services, stages, routing** — `company.html`, the `SERVICES`, `STAGES`
and `NEEDS` constants at the top of the page script.

**Solver questions and results** — `index.html`, the `TREE`, `SERVICES` and
`RULES` constants. Each question is a node; `next` returns the id of the
following question or `{terminal:'...'}` to finish.

## Before launch

- Point `thefounderandco.com` at the host. The canonical URLs, sitemap and
  social cards already assume that domain.
- Set `SITE.formEndpoint` so the solver captures rather than discards.
- Name the form processor in `privacy.html`, under "Who else is involved".
  It is the one placeholder on that page.
- Have a lawyer read `privacy.html`. It is accurate about what the site
  actually does, but it is not legal advice.

## Deploying

Upload the folder. `index.html` is the homepage. Fonts come from Google
Fonts; everything else is local.
