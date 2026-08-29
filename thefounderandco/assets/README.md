# Assets

## Portrait

`imran-yousuf.jpg` — 512 x 640, already cropped 4:5 for the frame in
section 05. If you have a higher-resolution original, drop it in under the
same name: at 1024 x 1280 it would stay sharp on retina screens. The page
falls back to a designed placeholder if the file is ever missing, so
nothing breaks while you swap it.

## Brand mark

`favicon.svg` is the mark rebuilt as vector — a lime dot with six white
round-cap strokes on the ink square. It was traced from the supplied
artwork rather than redrawn by eye: stroke weight, dot radius and every
endpoint match the original. The PNGs beside it (32 / 180 / 512) are
rendered from that SVG for browsers without SVG-favicon support, for iOS
home screens, and for the web manifest. Regenerate them from the SVG if
the mark ever changes; do not edit them separately.

## Logos

The "companies we have worked with" strip in section 06 is set as
wordmarks, not image files, so nothing looks stretched or mismatched.
To use real logo files instead, edit `LOGOS_A` / `LOGOS_B` in
`company.html` and swap the `<span class="logo">` markup in the `fill()`
helper for `<img>` tags. Use SVG where you can.
