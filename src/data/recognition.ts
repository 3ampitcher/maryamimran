import type { EducationItem, RecognitionItem } from './types';

/* ============================================================
   EDUCATION + RECOGNITION
   ------------------------------------------------------------
   `verified: false` entries stay in the data and are never
   rendered. Flip to true once you've confirmed the exact wording.
   No trophies, no medals, no certificate wall — numbers and type.
   ============================================================ */

export const education: EducationItem[] = [
  {
    id: 'ubt-bais',
    institution: 'University of Business & Technology',
    qualification: 'Business Analytics & Information Systems',
    detail: ['Jeddah, Saudi Arabia', 'College of Business Administration'],
    year: '2023—NOW',
    order: 1,
  },
  {
    id: 'cambridge',
    institution: 'Cambridge International',
    qualification: 'A Levels',
    detail: ['Economics A*', 'Business A*', 'Mathematics A'],
    year: '2023',
    order: 2,
  },
];

export const recognition: RecognitionItem[] = [
  {
    id: 'cgpa',
    value: '5.0',
    title: 'CGPA',
    organization: 'University of Business & Technology',
    year: '2023—NOW',
    detail: 'Out of 5.0',
    verified: true,
    group: 'academic',
    order: 1,
  },
  {
    id: 'cba-recognition',
    title: 'Academic Recognition',
    organization: 'College of Business Administration, UBT',
    year: '2025',
    verified: true,
    group: 'academic',
    order: 2,
  },
  {
    id: 'outstanding-cambridge-learner',
    title: 'Outstanding Cambridge Learner',
    organization: 'Cambridge International',
    year: '2023',
    /* TODO(maryam): the "Top in Saudi Arabia — Economics" recognition goes here once
       you supply the exact certificate wording. Set verified: true to publish it. */
    verified: true,
    group: 'academic',
    order: 3,
  },
  {
    id: 'top-in-saudi-economics',
    title: 'Top in Saudi Arabia — Economics',
    organization: 'Cambridge International',
    year: '2023',
    /* TODO(maryam): add `detail` using the exact wording printed on the
       certificate, then set verified: true to publish this entry. */
    verified: false,
    group: 'academic',
    order: 4,
  },
  {
    id: 'ie-robotics-first',
    value: '1ST',
    title: 'Breakthrough Robotics Program',
    organization: 'IE University, Madrid',
    year: '2025',
    detail: 'VITA — Visual Infrared Transport Assistant',
    verified: true,
    group: 'competition',
    order: 5,
  },
  {
    id: 'moonshot-pirates-result',
    value: 'TOP 7',
    title: 'Moonshot Pirates',
    year: '2024',
    /* TODO(maryam): confirm the exact wording (Top 7 of 78), add it as
       `detail`, then set verified: true to publish this entry. */
    verified: false,
    group: 'competition',
    order: 6,
  },
  {
    id: 'appreciation-letters',
    title: 'Letters of Appreciation',
    organization: 'University of Business & Technology',
    year: '2025',
    detail: 'For sustainability programming and institutional work',
    verified: true,
    group: 'appreciation',
    order: 7,
  },
];

/** Only verified entries ever reach the UI. */
export const publishedRecognition: RecognitionItem[] = recognition
  .filter((r) => r.verified)
  .sort((a, b) => a.order - b.order);

export const educationSorted: EducationItem[] = [...education].sort((a, b) => a.order - b.order);
