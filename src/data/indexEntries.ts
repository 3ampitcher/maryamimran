import type { Category, MediaItem, Tag, WorkItem } from './types';
import { work } from './work';
import { writingSorted } from './writing';
import { programsSorted } from './programs';
import { publishedRecognition } from './recognition';

/* ============================================================
   INDEX ENTRIES
   ------------------------------------------------------------
   One flat, uniform shape derived from the existing data files.
   Nothing is re-authored here: work.ts, writing.ts, programs.ts
   and recognition.ts remain the single sources of truth, and
   this module only projects them into a common row.

   Seven groups make up the table of contents. Business,
   Technology and Impact partition the work by primary category.
   Speaking is a lens rather than a partition — a talk is still
   Technology work, and it appears in both places on purpose.
   ============================================================ */

export type IndexGroup =
  | 'business'
  | 'technology'
  | 'impact'
  | 'speaking'
  | 'writing'
  | 'learning'
  | 'recognition';

export interface IndexEntry {
  /** Unique across groups — an item in two groups gets two ids. */
  key: string;
  group: IndexGroup;
  title: string;
  titleAlt?: string;
  /** Right-hand column: role, type, topic or organisation. */
  meta: string;
  year: string;
  yearSort: number;
  tags: Tag[];
  category?: Category;
  shortDescription?: string;
  featuredMedia?: MediaItem;
  /** Present for work-backed rows — drives the full expandable record. */
  work?: WorkItem;
  /** Expanded body for rows that aren't work items. */
  detail?: string;
  /** Rows that link out instead of expanding. */
  href?: string;
}

export const groupMeta: Record<IndexGroup, { label: string; blurb: string }> = {
  business: { label: 'Business', blurb: 'Startups, analytics, operations, marketing' },
  technology: { label: 'Technology', blurb: 'AI, robotics, emerging tech, prototyping' },
  impact: { label: 'Impact', blurb: 'Sustainability, leadership, institutional work' },
  speaking: { label: 'Speaking', blurb: 'Sessions, pitches, workshops and talks' },
  writing: { label: 'Writing', blurb: 'Short pieces, mostly written to work something out' },
  learning: { label: 'Learning', blurb: 'Programs, accelerators and courses' },
  recognition: { label: 'Recognition', blurb: 'Verified results and academic recognition' },
};

/** Fixed display order for the table of contents and the grouped view. */
export const groupOrder: IndexGroup[] = [
  'business',
  'technology',
  'impact',
  'speaking',
  'writing',
  'learning',
  'recognition',
];

const newestFirst = (a: IndexEntry, b: IndexEntry) => b.yearSort - a.yearSort;

function fromWork(item: WorkItem, group: IndexGroup): IndexEntry {
  return {
    key: `${group}:${item.id}`,
    group,
    title: item.title,
    titleAlt: item.titleAlt,
    meta: item.role,
    year: item.year,
    yearSort: item.yearSort,
    tags: item.secondaryTags,
    category: item.primaryCategory,
    shortDescription: item.shortDescription,
    featuredMedia: item.featuredMedia,
    work: item,
  };
}

/* --- Work, partitioned by primary category --- */
const workEntries: IndexEntry[] = work
  .filter((w) => w.showInIndex)
  .map((w) => fromWork(w, w.primaryCategory));

/* --- Speaking: the same records seen through a different lens --- */
const speakingEntries: IndexEntry[] = work
  .filter((w) => w.showInIndex && w.showInSpeaking)
  .map((w) => fromWork(w, 'speaking'));

/* --- Writing --- */
const writingEntries: IndexEntry[] = writingSorted.map((w) => ({
  key: `writing:${w.id}`,
  group: 'writing' as const,
  title: w.title,
  meta: w.topic,
  year: w.date,
  yearSort: w.yearSort,
  tags: ['write'] as Tag[],
  shortDescription: w.shortDescription,
  detail: w.shortDescription,
  href: w.externalLink || undefined,
}));

/* --- Programs --- */
const learningEntries: IndexEntry[] = programsSorted.map((p) => ({
  key: `learning:${p.id}`,
  group: 'learning' as const,
  title: p.name,
  meta: p.location ?? 'Program',
  year: p.year,
  yearSort: Number(String(p.year).slice(0, 4)) || 0,
  tags: ['learn'] as Tag[],
  shortDescription: p.what,
  detail: p.what,
}));

/* --- Recognition (verified only) --- */
const recognitionEntries: IndexEntry[] = publishedRecognition.map((r) => ({
  key: `recognition:${r.id}`,
  group: 'recognition' as const,
  title: r.value ? `${r.value} — ${r.title}` : r.title,
  meta: r.organization ?? 'Recognition',
  year: r.year,
  yearSort: Number(String(r.year).slice(0, 4)) || 0,
  tags: [] as Tag[],
  shortDescription: r.detail,
  detail: r.detail,
}));

export const indexEntries: IndexEntry[] = [
  ...workEntries,
  ...speakingEntries,
  ...writingEntries,
  ...learningEntries,
  ...recognitionEntries,
];

/** Entries for one group, newest first. */
export const entriesInGroup = (group: IndexGroup): IndexEntry[] =>
  indexEntries.filter((e) => e.group === group).sort(newestFirst);

/** Counts for the table of contents. */
export const groupCounts: Record<IndexGroup, number> = groupOrder.reduce(
  (acc, g) => {
    acc[g] = indexEntries.filter((e) => e.group === g).length;
    return acc;
  },
  {} as Record<IndexGroup, number>,
);

/** Distinct records, so the total doesn't double-count the Speaking lens. */
export const distinctEntryCount = new Set(
  indexEntries.map((e) => (e.work ? e.work.id : e.key)),
).size;
