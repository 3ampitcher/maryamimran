import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { programsSorted } from '../../data/programs';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { useHasHover } from '../../hooks/useMediaQuery';
import './Programs.css';

/* ============================================================
   PROGRAMS
   ------------------------------------------------------------
   A restrained editorial grid. Each entry names the place and,
   on open, what actually happened there — attendance on its own
   carries no weight and gets no visual reward.

   Smaller certificates and one-off learning live in the Index
   rather than being listed here, which keeps About readable.
   ============================================================ */

export function Programs() {
  const [open, setOpen] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const hasHover = useHasHover();

  return (
    <section className="section programs" aria-labelledby="programs-heading">
      <div className="shell">
        <div className="section-head__meta programs__meta">
          <h2 id="programs-heading" className="label">
            Programs
          </h2>
          <p className="label">{programsSorted.length}</p>
        </div>

        <ul className="programs__grid">
          {programsSorted.map((p) => {
            const isOpen = open === p.id;
            return (
              <li
                key={p.id}
                className={`pcell ${isOpen ? 'pcell--open' : ''}`}
                onMouseEnter={() => hasHover && setOpen(p.id)}
                onMouseLeave={() => hasHover && setOpen(null)}
              >
                <button
                  type="button"
                  className="pcell__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`program-${p.id}`}
                  onClick={() => setOpen(isOpen ? null : p.id)}
                >
                  <span className="pcell__name">{p.name}</span>
                  <span className="pcell__aside mono">
                    {p.location && <span>{p.location}</span>}
                    <span>{p.year}</span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`program-${p.id}`}
                      className="pcell__what"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={reduced ? {} : { height: 'auto', opacity: 1 }}
                      exit={reduced ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="pcell__what-text">{p.what}</p>
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
