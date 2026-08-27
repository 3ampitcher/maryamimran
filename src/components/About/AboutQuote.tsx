import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import './AboutQuote.css';

/* ============================================================
   ABOUT — THE OPENING QUOTE
   ------------------------------------------------------------
   A near-full-screen typographic moment before anything about
   Maryam appears. Stone ground, graphite type, and cobalt
   arriving only on the last two words as the panel scrolls.
   ============================================================ */

export function AboutQuote() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="aquote ground-stone" aria-labelledby="about-quote">
      <motion.div
        className="shell aquote__inner"
        style={reduced ? undefined : { y, opacity }}
      >
        <blockquote className="aquote__block">
          <p id="about-quote" className="aquote__text">
            “The people who are crazy enough to think they can change the world are the
            <span className="aquote__emphasis"> ones who do</span>.”
          </p>
          <footer className="aquote__attribution">
            <span className="mono">Apple</span>
            <span className="aquote__sep" aria-hidden="true">
              —
            </span>
            <span className="mono">Think Different</span>
          </footer>
        </blockquote>
      </motion.div>
    </section>
  );
}
