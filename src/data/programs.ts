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
    year: '2024—NOW',
    what: 'Business Analytics & Information Systems — the degree, plus the sustainability reporting, club leadership and advisory board work that grew out of it.',
    relatedWork: ['sustainability-club', 'ui-greenmetric', 'bais-advisory-board'],
    order: 1,
  },
  {
    id: 'monshaat',
    name: 'Monsha’at Human Capital Program',
    location: 'Saudi Arabia',
    year: '2025—NOW',
    what: 'Building Tiin with guidance from Saudi founders, investors and ecosystem mentors.',
    relatedWork: ['tiin', 'tiin-demo-day'],
    order: 2,
  },
  {
    id: 'ie-university',
    name: 'IE University',
    location: 'Madrid',
    year: '2025',
    what: 'Breakthrough Robotics Program. Built VITA — infrared following, Arduino and Raspberry Pi, and a hospital logistics research question underneath it.',
    relatedWork: ['vita'],
    order: 3,
  },
  {
    id: 'tks',
    name: 'The Knowledge Society',
    year: '2023–24',
    what: 'Emerging technology research, hackathons and moonshot projects — and pitching them to Meta’s Oversight Board and the World Economic Forum.',
    relatedWork: ['tks', 'air-to-water'],
    order: 4,
  },
  {
    id: 'mckinsey-forward',
    name: 'McKinsey Forward Program',
    year: '2025',
    what: 'Structured problem solving, communication and the habit of writing the answer first.',
    order: 5,
  },
  {
    id: 'fintech-summer-sessions',
    name: 'Fintech Summer Sessions',
    location: 'Saudi Arabia',
    year: '2025',
    what: 'The Saudi fintech landscape — regulation, infrastructure and where SME finance actually sits in it.',
    relatedWork: ['tiin'],
    order: 6,
  },
  {
    id: 'misk-pristine',
    name: 'Misk × Pristine',
    year: '2025',
    what: 'Sustainability & Innovation — the innovation side of sustainability rather than the reporting side.',
    relatedWork: ['think-sustainability'],
    order: 7,
  },
  {
    id: 'mawhiba-metaminds',
    name: 'Mawhiba MetaMinds M3',
    year: '2023',
    what: 'Advanced enrichment programme.',
    order: 8,
  },
  {
    id: 'buildspace',
    name: 'buildspace',
    year: '2024',
    what: 'Ship something in a fixed number of weeks, in public, with everyone else doing the same.',
    order: 9,
  },
];

export const programsSorted: ProgramItem[] = [...programs].sort((a, b) => a.order - b.order);
