import type { WritingItem } from './types';

/* ============================================================
   WRITING
   ------------------------------------------------------------
   TODO(maryam): paste the real URL into `externalLink` for each
   piece. Entries without a link render as text (no dead links).
   Dates are placeholders where the exact date wasn't confirmed —
   correct them here and the ordering follows.
   ============================================================ */

export const writing: WritingItem[] = [
  {
    id: 'wrong-quickly',
    title: 'University teaches you to avoid being wrong. Real life rewards you for being wrong quickly.',
    date: '2026',
    yearSort: 2026,
    topic: 'Learning',
    shortDescription:
      'Four years of optimising for the right answer, then an environment that pays for the fast wrong one.',
    pullQuote:
      'University teaches you to avoid being wrong. Real life rewards you for being wrong quickly.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 1,
  },
  {
    id: 'harvard-rejection',
    title: 'On the Harvard rejection',
    date: '2025',
    yearSort: 2025,
    topic: 'Ambition',
    shortDescription:
      'What a no from the place you aimed at actually costs you, and what it doesn’t.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 2,
  },
  {
    id: 'is-money-enough',
    title: 'Is Money Enough?',
    date: '2025',
    yearSort: 2025,
    topic: 'Business',
    shortDescription:
      'On what capital solves for a small business, and the problems it leaves entirely intact.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 3,
  },
  {
    id: 'turning-20',
    title: 'Turning 20',
    date: '2025',
    yearSort: 2025,
    topic: 'Personal',
    shortDescription: 'A stocktake, written mostly for myself.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 4,
  },
  {
    id: 'learning-publicly',
    title: 'Learning publicly',
    date: '2025',
    yearSort: 2025,
    topic: 'Personal Branding',
    shortDescription:
      'The case for posting the half-finished version, and the actual cost of doing it.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 5,
  },
  {
    id: 'founder-reflections',
    title: 'Founder reflections',
    date: '2026',
    yearSort: 2026,
    topic: 'Entrepreneurship',
    shortDescription:
      'Notes from building Tiin — customer discovery, changing direction, and what that feels like from inside.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 6,
  },
  {
    id: 'sme-writing',
    title: 'On Saudi SMEs',
    date: '2026',
    yearSort: 2026,
    topic: 'Business',
    shortDescription:
      'What small business owners are actually asking for when they ask for better numbers.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 7,
  },
  {
    id: 'student-leadership',
    title: 'On student leadership',
    date: '2024',
    yearSort: 2024,
    topic: 'Leadership',
    shortDescription:
      'Running things at university, where nobody reports to you and everything is voluntary.',
    platform: 'LinkedIn',
    externalLink: '',
    order: 8,
  },
];

export const writingSorted: WritingItem[] = [...writing].sort(
  (a, b) => b.yearSort - a.yearSort || a.order - b.order,
);
