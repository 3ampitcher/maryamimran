# Resume

Put the PDF here, named exactly:

    Maryam-Imran-Resume.pdf

Then open `src/data/site.ts` and set:

    resume: {
      path: '/resume/Maryam-Imran-Resume.pdf',
      available: true,   // <- flip this
    }

That single flag turns on the Resume link in the navigation, the mobile menu,
the About page and the Contact section at once. While it is `false` those links
are not rendered at all, so the site never shows a link that 404s.

To use a different filename, change `path` to match.
