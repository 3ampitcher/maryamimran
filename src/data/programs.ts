import type { ProgramItem } from './types';

/* ============================================================
   PLACES I'VE LEARNED
   ------------------------------------------------------------
   Not a certificate wall. Each entry has to say what actually
   happened there — `what` is the whole point of the section.
   ============================================================ */

export const programs: ProgramItem[] = [
  {
    id: 'ubt',
    name: 'University of Business & Technology',
    location: 'Jeddah',
    year: '2023—NOW',
    what: 'Business Analytics & Information Systems — the degree, plus the sustainability and advisory board work that grew out of it.',
    relatedWork: ['sustainability-club', 'ui-greenmetric', 'bais-advisory-board'],
    order: 1,
  },
  {
    id: 'ie-university',
    name: 'IE University',
    location: 'Madrid',
    year: '2025',
    what: 'Breakthrough Robotics Program. Built VITA — infrared following, Arduino and Raspberry Pi, and a hospital logistics research question underneath it.',
    relatedWork: ['vita'],
    order: 2,
  },
  {
    id: 'tks',
    name: 'The Knowledge Society',
    year: '2023–24',
    what: 'Emerging technology research and challenges, and the habit of having to present what you found to people who ask hard questions.',
    relatedWork: ['tks', 'air-to-water'],
    order: 3,
  },
  {
    id: 'monshaat',
    name: 'Monsha’at',
    location: 'Saudi Arabia',
    year: '2026',
    what: 'Accelerator programme with Tiin — customer discovery, business model work and Demo Day.',
    relatedWork: ['tiin', 'tiin-demo-day'],
    order: 4,
  },
  {
    id: 'mckinsey-forward',
    name: 'McKinsey Forward',
    year: '2025',
    what: 'Structured problem solving, communication and the habit of writing the answer first.',
    order: 5,
  },
  {
    id: 'fintech-saudi',
    name: 'Fintech Saudi',
    location: 'Saudi Arabia',
    year: '2025',
    what: 'The Saudi fintech landscape — regulation, infrastructure and where SME finance actually sits in it.',
    relatedWork: ['tiin'],
    order: 6,
  },
  {
    id: 'mawhiba-metaminds',
    name: 'Mawhiba MetaMinds M3',
    year: '2023',
    what: 'Advanced enrichment programme.',
    order: 7,
  },
  {
    id: 'buildspace',
    name: 'buildspace',
    year: '2024',
    what: 'Ship something in a fixed number of weeks, in public, with everyone else doing the same.',
    order: 8,
  },
];

export const programsSorted: ProgramItem[] = [...programs].sort((a, b) => a.order - b.order);
