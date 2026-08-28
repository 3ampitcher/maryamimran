# Assets

## Portrait

Drop a photo of Imran here named exactly:

    imran-yousuf.jpg

Portrait crop, 4:5 ratio, at least 800 x 1000px. The page picks it up
automatically. Until the file exists, section 05 shows a designed
placeholder instead — nothing breaks.

## Logos

The "companies we have worked with" strip in section 06 is set as
wordmarks, not image files, so nothing looks stretched or mismatched.
To use real logo files instead, edit `LOGOS_A` / `LOGOS_B` in
`company.html` and swap the `<span class="logo">` markup in the `fill()`
helper for `<img>` tags. Use SVG where you can.
