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

  /* --- Portrait -------------------------------------------------------
     cutout: true expects a transparent PNG (background removed) placed
     straight onto the stone hero — person and typography on one surface.
     cutout: false uses a normal rectangular photo whose lower edge is
     dissolved into the ground, so it still never reads as a photo card.
     Either file works; only this flag changes the treatment. */
  portrait: {
    src: '/assets/portrait/maryam-portrait.png',
    aboutSrc: '/assets/portrait/maryam-about.jpg',
    cutout: true,
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
