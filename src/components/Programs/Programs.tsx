import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { programsSorted } from '../../data/programs';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { useHasHover } from '../../hooks/useMediaQuery';
import './Programs.css';

/* ============================================================
   PLACES I'VE LEARNED
   ------------------------------------------------------------
   Not "Certificates". A typographic list where the interesting
   half — what actually happened there — is what gets revealed.
   Attendance on its own carries no visual weight.
   ============================================================ */

export function Programs() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const hasHover = useHasHover();

  return (
    <section className="section programs" aria-labelledby="programs-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">09</span> Learning
            </p>
            <p className="label">{programsSorted.length} places</p>
          </div>
          <h2 id="programs-heading" className="headline programs__headline">
            Places I’ve learned.
          </h2>
        </div>

        <ul className="programs__list">
          {programsSorted.map((p) => {
            const isOpen = open === p.id;
            return (
              <li
                key={p.id}
                className={`prow ${isOpen ? 'prow--open' : ''}`}
                onMouseEnter={() => hasHover && setOpen(p.id)}
                onMouseLeave={() => hasHover && setOpen(null)}
              >
                <button
                  type="button"
                  className="prow__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`program-${p.id}`}
                  onClick={() => setOpen(isOpen ? null : p.id)}
                >
                  <span className="prow__name">{p.name}</span>
                  <span className="prow__aside">
                    {p.location && <span className="prow__location">{p.location}</span>}
                    <span className="prow__year mono">{p.year}</span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`program-${p.id}`}
                      className="prow__what"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                      exit={reduced ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="prow__what-text">{p.what}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
