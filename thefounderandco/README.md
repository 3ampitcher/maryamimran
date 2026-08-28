# TheFounder&Co.

Two static pages, one brand system. No build step, no dependencies —
open the files or drop the folder on any static host.

    index.html      the solver: the interactive "what do we actually need"
                    tool. Logic engine unchanged from the original.
    company.html    the long-scroll site: why we exist, the seven services,
                    the stage map, the routing tree, who is behind it,
                    proof, contact.
    assets/
      brand.css     colour, type, nav, footer, motion. Shared by both pages.
      site.js       the SITE config (every contact link on the site reads
                    from it), scroll progress, scroll reveals.
      README.md     where to put the portrait and logo files.

## Changing things

**Contact details** — `assets/site.js`, the `SITE` object at the top.
Email, phone, WhatsApp number, website, LinkedIn, location. Every link on
both pages is generated from it. Set `linkedin` to a real URL and the
LinkedIn row appears in both footers automatically.

**Brand colour / type** — `assets/brand.css`, the `:root` block.

**Services, stages, routing** — `company.html`, the `SERVICES`, `STAGES`
and `NEEDS` constants at the top of the page script. Rename a service in
`SERVICES` and it updates in the stage map, the orbit diagram and the
routing tree at the same time.

**Solver questions and results** — `index.html`, the `TREE`, `SERVICES`
and `RULES` constants. Each question is a node; `next` returns the id of
the following question or `{terminal:'...'}` to finish.

## Deploying

Upload the folder. That is the whole process. Fonts come from Google
Fonts; everything else is local.
