import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkItem } from '../../data/types';
import { Figure } from '../Media/Figure';
import { WorkRecord } from '../ExpandableWork/WorkRecord';
import { Reveal } from '../Motion/Reveal';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './TechnologyGrid.css';

/* ============================================================
   TECHNOLOGY GRID — the lab
   ------------------------------------------------------------
   Deliberately unlike Business. Irregular modules — a large
   photograph, a small artifact, a text block, a result set
   large — all held to one underlying 12-column grid so it reads
   as composed rather than as a collage.

   Module size comes from the item's `scale`, so adding work to
   the data reshapes the grid without touching this component.
   ============================================================ */

export function TechnologyGrid({ items }: { items: WorkItem[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const baseId = useId();

  return (
    <div className="techgrid">
      {items.map((item, i) => {
        const isOpen = expanded === item.id;
        const panelId = `${baseId}-${item.id}`;
        const size = item.scale ?? 'standard';

        return (
          <article
            key={item.id}
            className={`techmod techmod--${size} techmod--${i % 3} ${
              isOpen ? 'techmod--open' : ''
            }`}
          >
            <Reveal delay={(i % 3) * 0.06} y={30}>
              <div className="techmod__inner">
                {item.featuredMedia && (
                  <div className="techmod__media">
                    <Figure
                      media={item.featuredMedia}
                      label={item.title}
                      sizes="(max-width: 767px) 92vw, (max-width: 1200px) 46vw, 38vw"
                    />
                  </div>
                )}

                <div className="techmod__body">
                  <p className="techmod__meta mono">
                    <span>{item.year}</span>
                    <span className="techmod__meta-sep" aria-hidden="true">
                      /
                    </span>
                    <span>{item.role}</span>
                  </p>

                  <h3 className="techmod__title">{item.title}</h3>

                  {item.result && <p className="techmod__result">{item.result}</p>}

                  {item.organization && (
                    <p className="techmod__org">{item.organization}</p>
                  )}

                  <p className="techmod__desc">{item.shortDescription}</p>

                  <div className="tag-row techmod__tags">
                    {item.secondaryTags.slice(0, 4).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="techmod__toggle label label--accent"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpanded(isOpen ? null : item.id)}
                  >
                    {isOpen ? 'Collapse' : 'Open'}
                    <span aria-hidden="true">{isOpen ? '↑' : '↓'}</span>
                  </button>
                </div>
              </div>
            </Reveal>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className="techmod__panel"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                  exit={reduced ? {} : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <WorkRecord item={item} />
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
