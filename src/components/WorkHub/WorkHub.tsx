import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { categoryMeta, workByCategory } from '../../data/work';
import type { Category } from '../../data/types';
import { Figure } from '../Media/Figure';
import { MaskReveal } from '../Motion/Reveal';
import { useHasHover } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './WorkHub.css';

/* ============================================================
   WORK HUB — SECTION 03
   ------------------------------------------------------------
   Three large editorial regions, not cards. Hovering a row
   raises a layered set of previews drawn from the real work in
   that category — so the preview is always the actual body of
   work, never decoration.

   On touch, hover is inert: the rows are plain links and the
   discipline list carries the same information hover would.
   ============================================================ */

const order: Category[] = ['business', 'technology', 'impact'];

export function WorkHub() {
  const [active, setActive] = useState<Category | null>(null);
  const hasHover = useHasHover();
  const reduced = usePrefersReducedMotion();

  return (
    <section className="section section--tall hub" aria-labelledby="hub-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">02</span> Work
            </p>
            <p className="label">Three directions, one body of work</p>
          </div>
          <h2 id="hub-heading" className="sr-only">
            Work
          </h2>
        </div>
      </div>

      <div
        className={`hub__rows ${active ? 'hub__rows--dimmed' : ''}`}
        onMouseLeave={() => setActive(null)}
      >
        {order.map((key) => {
          const meta = categoryMeta[key];
          const items = workByCategory(key);
          const previews = items.filter((i) => i.featuredMedia).slice(0, 4);

          return (
            <Link
              key={key}
              to={meta.path}
              className={`hubrow ${active === key ? 'hubrow--active' : ''}`}
              onMouseEnter={() => hasHover && setActive(key)}
              onFocus={() => hasHover && setActive(key)}
              onBlur={() => setActive(null)}
              aria-label={`${meta.title} — ${items.length} items`}
            >
              <div className="shell hubrow__inner">
                <span className="hubrow__index mono">{meta.index}</span>

                <span className="hubrow__title">
                  <MaskReveal>
                    <span className="hubrow__title-text">{meta.title}</span>
                  </MaskReveal>
                </span>

                <span className="hubrow__disciplines">
                  {meta.disciplines.map((d, i) => (
                    <span key={d} className="hubrow__discipline">
                      {i > 0 && <span aria-hidden="true"> · </span>}
                      {d}
                    </span>
                  ))}
                </span>

                <span className="hubrow__meta">
                  <span className="hubrow__count mono">
                    {String(items.length).padStart(2, '0')}
                  </span>
                  <span className="hubrow__arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </div>

              {/* Atmospheric layered previews — desktop hover only. */}
              {hasHover && !reduced && (
                <span className="hubrow__previews" aria-hidden="true">
                  <AnimatePresence>
                    {active === key &&
                      previews.map((item, i) => (
                        <motion.span
                          key={item.id}
                          className={`hubprev hubprev--${i}`}
                          initial={{ opacity: 0, y: 26, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.98 }}
                          transition={{
                            duration: 0.55,
                            delay: i * 0.045,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Figure
                            media={item.featuredMedia!}
                            label={item.title}
                            noScale
                            className="hubprev__figure"
                          />
                          <span className="hubprev__name mono">{item.title}</span>
                        </motion.span>
                      ))}
                  </AnimatePresence>
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
