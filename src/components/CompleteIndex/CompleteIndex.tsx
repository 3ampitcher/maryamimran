import { useDeferredValue, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Tag } from '../../data/types';
import {
  distinctEntryCount,
  entriesInGroup,
  groupCounts,
  groupMeta,
  groupOrder,
  type IndexEntry,
  type IndexGroup,
} from '../../data/indexEntries';
import { Figure } from '../Media/Figure';
import { WorkRecord } from '../ExpandableWork/WorkRecord';
import { MaskReveal } from '../Motion/Reveal';
import { useHasHover } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './CompleteIndex.css';

/* ============================================================
   COMPLETE INDEX — the permanent archive
   ------------------------------------------------------------
   A reference system, not a résumé table.

   It opens on a table of contents: seven large editorial rows
   with counts. Choosing one filters to that group; the default
   view renders every group in sequence under its own heading,
   so nothing is ever presented as one flat chronological list.

   Search, tags, years, hover previews and expandable records
   are all preserved from the previous version. All filtering
   is client-side against an in-memory array.
   ============================================================ */

const tags: Tag[] = ['build', 'lead', 'analyze', 'research', 'speak', 'write', 'learn', 'compete'];

type Era = '2026' | '2025' | '2024' | 'earlier';
const eras: Era[] = ['2026', '2025', '2024', 'earlier'];

const inEra = (e: IndexEntry, era: Era) =>
  era === 'earlier' ? e.yearSort < 2024 : e.yearSort === Number(era);

export function CompleteIndex() {
  const [group, setGroup] = useState<IndexGroup | null>(null);
  const [tag, setTag] = useState<Tag | null>(null);
  const [era, setEra] = useState<Era | null>(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();
  const baseId = useId();
  const resultsRef = useRef<HTMLDivElement>(null);

  const deferredQuery = useDeferredValue(query);

  const matches = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    return (entry: IndexEntry) => {
      if (tag && !entry.tags.includes(tag)) return false;
      if (era && !inEra(entry, era)) return false;
      if (!q) return true;

      return [
        entry.title,
        entry.titleAlt,
        entry.meta,
        entry.year,
        entry.group,
        entry.shortDescription,
        ...entry.tags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    };
  }, [tag, era, deferredQuery]);

  /* Groups to render, each with its surviving entries. */
  const sections = useMemo(
    () =>
      groupOrder
        .filter((g) => group === null || g === group)
        .map((g) => ({ group: g, entries: entriesInGroup(g).filter(matches) }))
        .filter((s) => s.entries.length > 0),
    [group, matches],
  );

  const total = sections.reduce((n, s) => n + s.entries.length, 0);
  const filtered = group !== null || tag !== null || era !== null || query !== '';

  const clear = () => {
    setGroup(null);
    setTag(null);
    setEra(null);
    setQuery('');
  };

  const chooseGroup = (g: IndexGroup) => {
    setGroup(group === g ? null : g);
    setExpanded(null);
    // Bring the results into view without stealing the whole scroll position.
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  };

  const allEntries = sections.flatMap((s) => s.entries);
  const previewItem =
    allEntries.find((e) => e.key === hovered) ?? allEntries.find((e) => e.featuredMedia) ?? null;

  return (
    <div className="cindex">
      {/* ============ TABLE OF CONTENTS ============ */}
      <nav className="toc" aria-label="Index contents">
        <p className="label toc__label">Contents</p>

        <ul className="toc__list">
          {groupOrder.map((g) => {
            const meta = groupMeta[g];
            const on = group === g;
            return (
              <li key={g}>
                <button
                  type="button"
                  className={`tocrow ${on ? 'tocrow--on' : ''}`}
                  aria-pressed={on}
                  onClick={() => chooseGroup(g)}
                >
                  <span className="tocrow__title">
                    <MaskReveal>
                      <span>{meta.label}</span>
                    </MaskReveal>
                  </span>
                  <span className="tocrow__blurb">{meta.blurb}</span>
                  <span className="tocrow__count mono">
                    {String(groupCounts[g]).padStart(2, '0')}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ============ CONTROLS ============ */}
      <div className="cindex__controls" ref={resultsRef}>
        <div className="cfilter">
          <span className="label cfilter__legend" id={`${baseId}-tag`}>
            Activity
          </span>
          <div className="cfilter__chips" role="group" aria-labelledby={`${baseId}-tag`}>
            {tags.map((t) => (
              <Chip key={t} on={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>

        <div className="cfilter">
          <span className="label cfilter__legend" id={`${baseId}-era`}>
            Year
          </span>
          <div className="cfilter__chips" role="group" aria-labelledby={`${baseId}-era`}>
            {eras.map((e) => (
              <Chip key={e} on={era === e} onClick={() => setEra(era === e ? null : e)}>
                {e}
              </Chip>
            ))}
          </div>
        </div>

        <div className="cfilter cfilter--search">
          <label className="label cfilter__legend" htmlFor={`${baseId}-search`}>
            Search
          </label>
          <div className="csearch">
            <input
              id={`${baseId}-search`}
              type="search"
              className="csearch__input"
              placeholder="Title, role, organisation…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {filtered && (
              <button type="button" className="csearch__clear label" onClick={clear}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unfiltered, the honest headline number is distinct records — the row
          total is higher because Speaking re-lists work already counted under
          its category. Once anything is filtered, the row count is what the
          reader is actually looking at. */}
      <p className="cindex__count label" role="status" aria-live="polite">
        {filtered ? (
          <>
            <span className="label__index">{String(total).padStart(2, '0')}</span>
            {total === 1 ? 'entry' : 'entries'}
            {group ? (
              <span className="cindex__count-of"> in {groupMeta[group].label}</span>
            ) : (
              <span className="cindex__count-of"> of {distinctEntryCount} records</span>
            )}
          </>
        ) : (
          <>
            <span className="label__index">{distinctEntryCount}</span>
            records in {groupOrder.length} groups
          </>
        )}
      </p>

      {/* ============ GROUPED RESULTS ============ */}
      <div className={`cindex__body ${hasHover ? 'cindex__body--withpreview' : ''}`}>
        {sections.length > 0 ? (
          <div className="cindex__groups" onMouseLeave={() => setHovered(null)}>
            {sections.map((section) => (
              <section
                key={section.group}
                className="cgroup"
                aria-labelledby={`${baseId}-g-${section.group}`}
              >
                <header className="cgroup__head">
                  <h3 id={`${baseId}-g-${section.group}`} className="cgroup__title">
                    {groupMeta[section.group].label}
                  </h3>
                  <span className="cgroup__count mono">
                    {String(section.entries.length).padStart(2, '0')}
                  </span>
                </header>

                <ul className="cindex__rows">
                  {section.entries.map((entry) => (
                    <Row
                      key={entry.key}
                      entry={entry}
                      open={expanded === entry.key}
                      hovered={hovered === entry.key}
                      hasHover={hasHover}
                      reduced={reduced}
                      panelId={`${baseId}-${entry.key}`}
                      onToggle={() => setExpanded(expanded === entry.key ? null : entry.key)}
                      onHover={() => hasHover && setHovered(entry.key)}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <div className="cindex__empty">
            <p className="cindex__empty-text">Nothing matches those filters.</p>
            <button type="button" className="textlink" onClick={clear}>
              Clear filters
            </button>
          </div>
        )}

        {hasHover && (
          <div className="cindex__preview" aria-hidden="true">
            <div className="cindex__preview-inner">
              <AnimatePresence mode="wait">
                {previewItem?.featuredMedia && (
                  <motion.div
                    key={previewItem.key}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? {} : { opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Figure
                      media={previewItem.featuredMedia}
                      label={previewItem.title}
                      noScale
                    />
                    <p className="cindex__preview-name mono">
                      {previewItem.shortDescription}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   ROW — work-backed rows expand into the full record; writing
   rows link out; everything else expands to its own detail.
   ------------------------------------------------------------ */

interface RowProps {
  entry: IndexEntry;
  open: boolean;
  hovered: boolean;
  hasHover: boolean;
  reduced: boolean;
  panelId: string;
  onToggle: () => void;
  onHover: () => void;
}

function Row({ entry, open, hovered, hasHover, reduced, panelId, onToggle, onHover }: RowProps) {
  const expandable = Boolean(entry.work || entry.detail);

  const inner = (
    <>
      <span className="crow__year mono">{entry.year}</span>
      <span className="crow__title">
        {entry.title}
        {entry.titleAlt && (
          <span className="crow__title-alt" lang="ar">
            {' '}
            | {entry.titleAlt}
          </span>
        )}
      </span>
      <span className="crow__meta">{entry.meta}</span>
      {expandable ? (
        <span className="crow__toggle" aria-hidden="true" />
      ) : (
        <span className="crow__link-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );

  return (
    <li
      className={`crow ${open ? 'crow--open' : ''} ${hovered ? 'crow--hover' : ''}`}
      onMouseEnter={onHover}
    >
      <h4 className="crow__h">
        {expandable ? (
          <button
            type="button"
            className="crow__trigger"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            onFocus={() => hasHover && onHover()}
          >
            {inner}
          </button>
        ) : (
          <a
            className="crow__trigger"
            href={entry.href}
            target="_blank"
            rel="noreferrer noopener"
            onFocus={() => hasHover && onHover()}
          >
            {inner}
          </a>
        )}
      </h4>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="crow__panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? {} : { height: 'auto', opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {entry.work ? (
              <WorkRecord item={entry.work} />
            ) : (
              <div className="crow__detail">
                <p className="prose">{entry.detail}</p>
                {entry.href && (
                  <a
                    className="textlink"
                    href={entry.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Read it
                    <span className="textlink__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                )}
              </div>
            )}
            <button type="button" className="crow__collapse label" onClick={onToggle}>
              Collapse <span aria-hidden="true">↑</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function Chip({
  children,
  on,
  onClick,
}: {
  children: React.ReactNode;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`chip ${on ? 'chip--on' : ''}`} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}
