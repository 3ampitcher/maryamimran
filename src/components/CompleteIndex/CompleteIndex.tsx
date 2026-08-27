import { useDeferredValue, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { indexWork } from '../../data/work';
import type { Category, Tag, WorkItem } from '../../data/types';
import { Figure } from '../Media/Figure';
import { WorkRecord } from '../ExpandableWork/WorkRecord';
import { useHasHover } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './CompleteIndex.css';

/* ============================================================
   COMPLETE INDEX — the permanent archive
   ------------------------------------------------------------
   Everything with showInIndex: true, filterable by category,
   activity tag and era, and searchable. All filtering is
   client-side against the in-memory array — no reloads, no
   network, no router state.
   ============================================================ */

const categories: Category[] = ['business', 'technology', 'impact'];
const tags: Tag[] = ['build', 'lead', 'analyze', 'research', 'speak', 'write', 'learn', 'compete'];

type Era = '2026' | '2025' | '2024' | 'earlier';
const eras: Era[] = ['2026', '2025', '2024', 'earlier'];

function inEra(item: WorkItem, era: Era): boolean {
  if (era === 'earlier') return item.yearSort < 2024;
  return item.yearSort === Number(era);
}

export function CompleteIndex() {
  const [category, setCategory] = useState<Category | null>(null);
  const [tag, setTag] = useState<Tag | null>(null);
  const [era, setEra] = useState<Era | null>(null);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();
  const baseId = useId();

  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();

    return indexWork.filter((item) => {
      if (category && item.primaryCategory !== category) return false;
      if (tag && !item.secondaryTags.includes(tag)) return false;
      if (era && !inEra(item, era)) return false;

      if (q) {
        const haystack = [
          item.title,
          item.titleAlt,
          item.organization,
          item.role,
          item.year,
          item.shortDescription,
          item.primaryCategory,
          ...item.secondaryTags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [category, tag, era, deferredQuery]);

  const hasFilters = category !== null || tag !== null || era !== null || query !== '';

  const clear = () => {
    setCategory(null);
    setTag(null);
    setEra(null);
    setQuery('');
  };

  const previewItem =
    results.find((i) => i.id === hovered) ?? results.find((i) => i.featuredMedia) ?? null;

  return (
    <div className="cindex">
      {/* --- Filters --- */}
      <div className="cindex__controls">
        <div className="cfilter">
          <span className="label cfilter__legend" id={`${baseId}-cat`}>
            Category
          </span>
          <div className="cfilter__chips" role="group" aria-labelledby={`${baseId}-cat`}>
            <Chip on={category === null} onClick={() => setCategory(null)}>
              All
            </Chip>
            {categories.map((c) => (
              <Chip key={c} on={category === c} onClick={() => setCategory(category === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

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
            {hasFilters && (
              <button type="button" className="csearch__clear label" onClick={clear}>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Count --- */}
      <p className="cindex__count label" role="status" aria-live="polite">
        <span className="label__index">{String(results.length).padStart(2, '0')}</span>
        {results.length === 1 ? 'item' : 'items'}
        {hasFilters && <span className="cindex__count-of"> of {indexWork.length}</span>}
      </p>

      <div className={`cindex__body ${hasHover ? 'cindex__body--withpreview' : ''}`}>
        {/* --- Rows --- */}
        {results.length > 0 ? (
          <ul className="cindex__rows" onMouseLeave={() => setHovered(null)}>
            {results.map((item) => {
              const isOpen = expanded === item.id;
              const panelId = `${baseId}-row-${item.id}`;

              return (
                <li
                  key={item.id}
                  className={`crow ${isOpen ? 'crow--open' : ''} ${
                    hovered === item.id ? 'crow--hover' : ''
                  }`}
                  onMouseEnter={() => hasHover && setHovered(item.id)}
                >
                  <h3 className="crow__h">
                    <button
                      type="button"
                      className="crow__trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setExpanded(isOpen ? null : item.id)}
                      onFocus={() => hasHover && setHovered(item.id)}
                    >
                      <span className="crow__year mono">{item.year}</span>
                      <span className="crow__title">
                        {item.title}
                        {item.titleAlt && (
                          <span className="crow__title-alt" lang="ar">
                            {' '}
                            | {item.titleAlt}
                          </span>
                        )}
                      </span>
                      <span className="crow__category mono">{item.primaryCategory}</span>
                      <span className="crow__role">{item.role}</span>
                      <span className="crow__toggle" aria-hidden="true" />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        className="crow__panel"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                        exit={reduced ? {} : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <WorkRecord item={item} />
                        <button
                          type="button"
                          className="crow__collapse label"
                          onClick={() => setExpanded(null)}
                        >
                          Collapse <span aria-hidden="true">↑</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="cindex__empty">
            <p className="cindex__empty-text">Nothing matches those filters.</p>
            <button type="button" className="textlink" onClick={clear}>
              Clear filters
            </button>
          </div>
        )}

        {/* --- Hover preview --- */}
        {hasHover && (
          <div className="cindex__preview" aria-hidden="true">
            <div className="cindex__preview-inner">
              <AnimatePresence mode="wait">
                {previewItem?.featuredMedia && (
                  <motion.div
                    key={previewItem.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? {} : { opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Figure media={previewItem.featuredMedia} label={previewItem.title} noScale />
                    <p className="cindex__preview-name mono">{previewItem.shortDescription}</p>
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

/* ------------------------------------------------------------ */

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
    <button
      type="button"
      className={`chip ${on ? 'chip--on' : ''}`}
      aria-pressed={on}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
