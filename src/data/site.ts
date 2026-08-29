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

  /* --- Contact ---------------------------------------------------------
     TODO(maryam): replace with the address and profile URLs you want public. */
  email: 'hello@mayamirman.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/maryam-imran-/',
    substack: '', // TODO(maryam): add your Substack URL to show the link.
  },

  /* --- Portrait ------------------------------------------------------- */
  portrait: {
    /* The hero is a full-bleed environmental portrait — a wide shot, not a
       headshot. Landscape, roughly 16:9, exported around 2400px wide. */
    src: '/assets/portrait/maryam-portrait.jpg',
    aboutSrc: '/assets/portrait/maryam-about.jpg',
    /* Where the face sits in the frame, as x% y%. The hero crops hard on
       tall/narrow viewports, and this is what keeps her in shot. Nudge these
       two numbers if a future photo is framed differently — nothing else
       needs to change. */
    focus: '62% 30%',
  },

  /* --- Resume ----------------------------------------------------------
     Drop the PDF at public/resume/Maryam-Imran-Resume.pdf and it goes live
     everywhere. Until the file exists the UI degrades gracefully. */
  resume: {
    path: '/resume/Maryam-Imran-Resume.pdf',
    /** Flip to true once the PDF is in place. */
    available: false,
  },

  /* --- Hero metadata (small, top-right of the portrait) --- */
  heroMeta: ['UBT', 'BAIS', '2026'],
} as const;

/* ============================================================
   LEAP — the only time-sensitive thing on the site.
   Adds one line to Contact. Set to false the day after LEAP and
   it disappears; nothing else depends on it.
   ============================================================ */
export const leapMode = true;
export const leapLine = 'At LEAP? Say hi.';
