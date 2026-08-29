# Wordmark

The logo as it appears on the site, with the type **converted to outlines**.
There is no live text and no font dependency — these render identically on
any machine, in any application, whether or not Manrope is installed.

    wordmark-on-dark.svg     white letters, lime & and .    (the site version)
    wordmark-on-light.svg    ink letters, deep-lime & and .
    wordmark-mono.svg        one colour, inherits currentColor
    wordmark-on-dark.png     2000 x 201, transparent
    wordmark-on-light.png    2000 x 201, transparent

## How they were made

Shaped with HarfBuzz against Manrope SemiBold (600) at the site's
letter-spacing of −0.035em, so the kerning is exactly what the browser
draws, then every glyph outlined from the font's own curves. Verified
against the live CSS wordmark at 64px — identical.

The trailing letter-spacing that CSS adds after the final character is
removed, so the artwork's bounding box is tight to the ink. That is why
the SVG measures fractionally narrower than the same text set live.

## Using them

**Aspect ratio 9.9427 : 1.** Scale by width and the height follows; never
set both and never stretch one axis.

**Clear space:** keep the height of the `C` free on all sides. At 50mm wide
that is about 5mm.

**Minimum size:** 22mm / 90px wide. Below that the lime full stop stops
reading and you should use the burst mark instead.

**On light backgrounds** use `wordmark-on-light.svg`. It swaps the accents
to `#93B518`, because the site's `#C8F03C` is close to invisible on white —
the full stop in particular disappears.

**One colour** — foil, embossing, embroidery, a single-plate print — use
`wordmark-mono.svg`. It carries no fill of its own and takes the colour of
whatever it sits in; set `color:` in CSS, or fill the paths in the artwork.

Do not recreate the wordmark by typing it out. The spacing is deliberate:
no spaces between words, −35 tracking, and only the `&` and the final `.`
in lime.
