import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Portrait } from '../Portrait/Portrait';
import { MaskRevealOnMount } from '../Motion/Reveal';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { site } from '../../data/site';
import './Hero.css';

/* ============================================================
   HERO — SECTION 01
   ------------------------------------------------------------
   Face first. The hero is about Maryam, not about the work.
   Composition: the portrait holds the centre, the name sits
   enormous across the bottom and deliberately runs past the
   viewport edges, and the positioning line reads beside it.

   Scroll choreography (motion vocabulary #7):
     stone -> paper, the name travels horizontally, the portrait
     settles and lifts, and cobalt appears for the first time.
   All of it collapses to a static composition under
   prefers-reduced-motion.
   ============================================================ */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* The giant name drifts left; the portrait lifts and eases back. */
  const nameX = useTransform(scrollYProgress, [0, 1], ['0%', '-14%']);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '-16%']);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="hero"
      aria-label="Introduction"
    >
      {/* Stone ground that wakes into paper as the hero leaves. */}
      <div className="hero__ground" aria-hidden="true" />

      <div className="hero__inner">
        {/* --- Top rail --- */}
        <motion.div
          className="hero__rail"
          style={reduced ? undefined : { opacity: metaOpacity }}
        >
          <span className="hero__place mono">{site.location}</span>
          <span className="hero__meta mono" aria-hidden="true">
            {site.heroMeta.map((m, i) => (
              <span key={m} className="hero__meta-item">
                {i > 0 && <span className="hero__meta-sep">/</span>}
                {m}
              </span>
            ))}
          </span>
        </motion.div>

        {/* --- Centre: the portrait --- */}
        <div className="hero__stage">
          <p className="hero__positioning">
            <MaskRevealOnMount delay={0.15}>
              <span className="hero__positioning-line">Business</span>
            </MaskRevealOnMount>
            <MaskRevealOnMount delay={0.24}>
              <span className="hero__positioning-line">
                <span className="hero__times" aria-hidden="true">
                  ×
                </span>
                <span className="sr-only"> and </span>
                Technology
              </span>
            </MaskRevealOnMount>
            <MaskRevealOnMount delay={0.33}>
              <span className="hero__positioning-line">
                <span className="hero__times" aria-hidden="true">
                  ×
                </span>
                <span className="sr-only"> and </span>
                Impact
              </span>
            </MaskRevealOnMount>
          </p>

          <motion.div
            className="hero__portrait"
            style={reduced ? undefined : { y: portraitY, scale: portraitScale }}
          >
            <Portrait
              priority
              ratio="4 / 5"
              objectPosition="center 24%"
              sizes="(max-width: 767px) 78vw, (max-width: 1200px) 42vw, 34vw"
              alt={`${site.name}, ${site.discipline} student in ${site.location}`}
            />
          </motion.div>

          <div className="hero__context">
            <MaskRevealOnMount delay={0.42}>
              <span className="hero__context-line">{site.discipline}</span>
            </MaskRevealOnMount>
            <MaskRevealOnMount delay={0.5}>
              <span className="hero__context-line hero__context-line--muted">
                {site.university}
              </span>
            </MaskRevealOnMount>
          </div>
        </div>

        {/* --- The name, enormous, running past both edges --- */}
        <div className="hero__nameband">
          <h1 className="sr-only">
            {site.name} — {site.positioning}
          </h1>
          <motion.span
            className="hero__name"
            aria-hidden="true"
            style={reduced ? undefined : { x: nameX, opacity: nameOpacity }}
          >
            <MaskRevealOnMount delay={0.05} innerClassName="hero__name-inner">
              Maryam Imran
            </MaskRevealOnMount>
          </motion.span>
        </div>

        {/* --- Scroll cue --- */}
        <motion.div
          className="hero__cue"
          style={reduced ? undefined : { opacity: metaOpacity }}
          aria-hidden="true"
        >
          <span className="mono">Scroll</span>
          <span className="hero__cue-line" />
        </motion.div>
      </div>
    </section>
  );
}
