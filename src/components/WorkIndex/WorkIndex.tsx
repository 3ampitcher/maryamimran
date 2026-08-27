import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkItem } from '../../data/types';
import { Figure } from '../Media/Figure';
import { WorkRecord } from '../ExpandableWork/WorkRecord';
import { useHasHover } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './WorkIndex.css';

/* ============================================================
   WORK INDEX
   ------------------------------------------------------------
   The Business experience: an interactive index, not a card
   grid. Generous rows of YEAR / WORK / ROLE / TAGS.

   Hover raises the matching image in a dedicated sticky visual
   region to the side. Click expands the record in place.
   On touch, the hover region is dropped entirely and tapping a
   row expands it — hover carries no unique information.
   ============================================================ */

interface WorkIndexProps {
  items: WorkItem[];
  /** Shows the sticky preview column (desktop only). */
  withPreview?: boolean;
}

export function WorkIndex({ items, withPreview = true }: WorkIndexProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();
  const baseId = useId();

  /* Falls back to the first item so the visual region is never empty. */
  const previewItem =
    items.find((i) => i.id === (hovered ?? expanded)) ?? items.find((i) => i.featuredMedia) ?? null;
  const showPreview = withPreview && hasHover;

  return (
    <div className={`windex ${showPreview ? 'windex--withpreview' : ''}`}>
      <ul className="windex__rows" onMouseLeave={() => setHovered(null)}>
        {items.map((item) => {
          const isOpen = expanded === item.id;
          const panelId = `${baseId}-${item.id}`;

          return (
            <li
              key={item.id}
              className={`windexrow ${isOpen ? 'windexrow--open' : ''} ${
                hovered === item.id ? 'windexrow--hover' : ''
              }`}
              onMouseEnter={() => hasHover && setHovered(item.id)}
            >
              <h3 className="windexrow__h">
                <button
                  type="button"
                  className="windexrow__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  onFocus={() => hasHover && setHovered(item.id)}
                >
                  <span className="windexrow__year mono">{item.year}</span>

                  <span className="windexrow__title">
                    {item.title}
                    {item.titleAlt && (
                      <span className="windexrow__title-alt" lang="ar">
                        {' '}
                        | {item.titleAlt}
                      </span>
                    )}
                  </span>

                  <span className="windexrow__role">{item.role}</span>

                  <span className="windexrow__tags" aria-hidden="true">
                    {item.secondaryTags.slice(0, 3).map((t) => (
                      <span key={t} className="windexrow__tag">
                        {t}
                      </span>
                    ))}
                  </span>

                  <span className="windexrow__toggle" aria-hidden="true">
                    <span className="windexrow__toggle-glyph" />
                  </span>
                </button>
              </h3>

              {/* Collapsed one-liner, so the row says something without hover. */}
              {!isOpen && <p className="windexrow__short">{item.shortDescription}</p>}

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className="windexrow__panel"
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                    exit={reduced ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <WorkRecord item={item} />
                    <button
                      type="button"
                      className="windexrow__collapse label"
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

      {/* Dedicated visual region — desktop only, decorative. */}
      {showPreview && (
        <div className="windex__preview" aria-hidden="true">
          <div className="windex__preview-inner">
            <AnimatePresence mode="wait">
              {previewItem?.featuredMedia && (
                <motion.div
                  key={previewItem.id}
                  initial={reduced ? false : { opacity: 0, scale: 1.03, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Figure
                    media={previewItem.featuredMedia}
                    label={previewItem.title}
                    noScale
                  />
                  <p className="windex__preview-name mono">{previewItem.title}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
