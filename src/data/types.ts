/* ============================================================
   CONTENT MODEL
   Every view on this site reads from these types. A work item is
   authored once in work.ts and referenced everywhere else — the
   hub, the category pages, Speaking, Recognition and the Index
   all render the same object.
   ============================================================ */

export type Category = 'business' | 'technology' | 'impact';

export type Tag =
  | 'build'
  | 'lead'
  | 'analyze'
  | 'research'
  | 'speak'
  | 'write'
  | 'learn'
  | 'compete'
  | 'market'
  | 'design'
  | 'operate';

/** A figure worth showing large. Only rendered when `verified` is true. */
export interface Metric {
  value: string;
  label: string;
  /** Unverified metrics are kept in data but never rendered. */
  verified: boolean;
}

export interface MediaItem {
  /** Path under /public, e.g. "/assets/business/tiin-ui.jpg". */
  src: string;
  /** Required. Describes the image for screen readers. */
  alt: string;
  /** Shown under the image in the expanded record. */
  caption?: string;
  /** Drives the placeholder's shape while no file exists at `src`. */
  ratio?: '1/1' | '4/3' | '3/2' | '16/9' | '3/4';
}

export interface ExternalLink {
  label: string;
  href: string;
}

/** A phase in a project's evolution. Rendered as a horizontal progression. */
export interface Phase {
  label: string;
  note?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  /** Rendered alongside the title where present. */
  titleAlt?: string;
  organization?: string;
  /** Display string for the year column, e.g. "2025—NOW". */
  year: string;
  /** Sortable numeric year — newest first in the Index. */
  yearSort: number;
  /** Optional finer-grained date, e.g. "March 2026". */
  date?: string;
  role: string;
  primaryCategory: Category;
  secondaryTags: Tag[];
  /** One line. Used in hover previews and collapsed rows. */
  shortDescription: string;
  /** Paragraphs. Rendered in the expanded record. */
  fullDescription?: string[];
  /** What Maryam actually did — bullets in the expanded record. */
  contribution?: string[];
  metrics?: Metric[];
  /** A single outcome line, rendered large. */
  result?: string;
  /** Iteration shown as a progression, never as a correction. */
  phases?: Phase[];
  images?: MediaItem[];
  /** The image used for hover previews and grid cards. */
  featuredMedia?: MediaItem;
  externalLinks?: ExternalLink[];
  showInIndex: boolean;
  showInSpeaking: boolean;
  showInRecognition: boolean;
  /** Lower sorts first within a category view. */
  order: number;
  /** Marks the handful of items that carry extra visual weight. */
  scale?: 'lead' | 'standard' | 'quiet';
}

export interface WritingItem {
  id: string;
  title: string;
  date: string;
  yearSort: number;
  topic: string;
  shortDescription: string;
  externalLink?: string;
  /** Where it was published. */
  platform?: 'LinkedIn' | 'Substack';
  /** Pull-quote rendered in a serif for a single editorial moment. */
  pullQuote?: string;
  order: number;
}

export interface ProgramItem {
  id: string;
  name: string;
  /** e.g. "Madrid, Spain" or "Riyadh". */
  location?: string;
  year: string;
  /** What Maryam actually did there — revealed on hover/expand. */
  what: string;
  /** Optional related work item ids. */
  relatedWork?: string[];
  order: number;
}

export interface RecognitionItem {
  id: string;
  /** The figure or grade, set large: "1ST", "5.0", "A*". */
  value?: string;
  title: string;
  organization?: string;
  year: string;
  detail?: string;
  /** Unverified entries are excluded from render. */
  verified: boolean;
  group: 'academic' | 'competition' | 'appreciation';
  order: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  qualification: string;
  detail?: string[];
  year: string;
  order: number;
}
