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
   NOW — time-sensitive. Edit freely; nothing structural reads it.
   ============================================================ */

export const now = {
  /** Shown as the "as of" stamp. */
  updated: 'August 2026',
  items: [
    {
      label: 'Studying',
      text: 'Business Analytics & Information Systems at UBT, Jeddah.',
    },
    {
      label: 'Building',
      text: 'Tiin — financial clarity for Saudi SMEs, currently through the accelerator and Demo Day.',
    },
    {
      label: 'Leading',
      text: 'Sustainability work at UBT — club, institutional reporting and campus programming.',
    },
    {
      label: 'Exploring',
      text: 'Agentic AI: where agents genuinely help, and where a plain script would do.',
    },
    {
      label: 'Writing',
      text: 'Short pieces on ambition, building things early, and being wrong quickly.',
    },
    {
      label: 'Next',
      text: 'LEAP 2026 in Riyadh.',
    },
  ],
} as const;

/* Temporary contact variation — set to false after LEAP. */
export const leapMode = true;
