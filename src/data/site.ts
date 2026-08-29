/* ============================================================
   SITE CONFIG
   Everything time-sensitive or personal lives here so it can be
   edited without touching a component.
   ============================================================ */

export const site = {
  name: 'Maryam Imran',
  initials: 'MI',
  domain: 'mayamirman.com',
  url: 'https://mayamirman.com',
  positioning: 'Business × Technology × Impact',
  discipline: 'Business Analytics & Information Systems',
  location: 'Jeddah, Saudi Arabia',
  university: 'University of Business & Technology',
  universityShort: 'UBT',

  title: 'Maryam Imran — Business × Technology × Impact',
  description:
    'Personal portfolio of Maryam Imran, a Business Analytics & Information Systems student in Jeddah working across startups, technology, sustainability, analytics, leadership and emerging ideas.',

  /* --- Contact --- */
  email: 'emailmaryamimran@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/maryamimranksa/',
    substack: '', // TODO(maryam): add your Substack URL to show the link.
  },

  /* --- Portrait ------------------------------------------------------- */
  portrait: {
    /* The hero is a full-bleed environmental portrait — a wide shot, not a
       headshot. Run `npm run images` after dropping a new original into
       source-images/ and the responsive set below is regenerated. */
    src: '/assets/portrait/maryam-portrait.jpg',
    aboutSrc: '/assets/portrait/maryam-about.jpg',
    /* Widths that exist on disk, smallest first. The browser picks one via
       srcset; `src` above is the fallback. Must match scripts/optimize-images.mjs. */
    widths: [800, 1200, 1796],
    /* Where the face sits in the frame, as x% y%. The hero crops hard on
       tall viewports and this is what keeps her in shot. */
    focus: '51% 34%',
  },

  /* --- Resume ----------------------------------------------------------
     Drop the PDF at public/resume/Maryam-Imran-Resume.pdf and it goes live
     everywhere. Until the file exists the UI degrades gracefully. */
  resume: {
    path: '/resume/Maryam-Imran-Resume.pdf',
    /** Flip to true once the PDF is in place. */
    available: false,
  },

} as const;

/* ============================================================
   LEAP — the only time-sensitive thing on the site.
   Adds one line to Contact. Set to false the day after LEAP and
   it disappears; nothing else depends on it.
   ============================================================ */
export const leapMode = true;
export const leapLine = 'At LEAP? Say hi.';
