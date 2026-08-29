import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Portrait } from '../Portrait/Portrait';
import { MaskRevealOnMount } from '../Motion/Reveal';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { site } from '../../data/site';
import './Hero.css';

/* ============================================================
   HERO — face first
   ------------------------------------------------------------
   The photograph is the page. It fills the viewport edge to
   edge and everything else sits on it: the name enormous along
   the bottom, the positioning line above it, a thin rail of
   metadata at the top. No card, no frame, no container.

   Legibility over photography is handled by two scrims (top and
   bottom) rather than by darkening the whole image — the shot is
   bright and airy and should stay that way.

   Scroll: the image drifts up slowly and the name a little
   faster, so the composition compresses rather than slides.
   ============================================================ */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* A slow drift on the image reads as depth; a faster one on the
     type makes the two feel like one composition compressing. */
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-32%']);
  /* The name is a continuous band of repeats; scrolling drags it sideways.
     Two copies, each wider than the viewport, so any offset in this range
     still covers the screen and the band never runs out. */
  const nameX = useTransform(scrollYProgress, [0, 1], ['0%', '-32%']);
  const nameOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section ref={ref} className="hero" aria-label="Introduction">
      {/* --- The photograph --- */}
      <motion.div
        className="hero__media"
        style={reduced ? undefined : { y: mediaY, scale: mediaScale }}
      >
        <Portrait
          fill
          priority
          sizes="100vw"
          alt={`${site.name}, ${site.discipline} student in ${site.location}`}
          placeholderNote="Hero photograph → maryam-portrait.jpg"
        />
      </motion.div>

      {/* Two soft scrims, not a blanket darkening. */}
      <div className="hero__scrim hero__scrim--top" aria-hidden="true" />
      <div className="hero__scrim hero__scrim--bottom" aria-hidden="true" />

      {/* Self-contained dark pill: legible wherever the photograph is bright. */}
      <div className="hero__located">
        <span className="hero__located-text">
          Located in
          <br />
          {site.location}
        </span>
        <span className="hero__located-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.25">
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3.2 9h17.6M3.2 15h17.6" />
          </svg>
        </span>
      </div>

      {/* --- Everything else sits on the photograph --- */}
      <div className="hero__inner">
        <motion.div
          className="hero__foot"
          style={reduced ? undefined : { y: nameY, opacity: nameOpacity }}
        >
          <p className="hero__positioning">
            <MaskRevealOnMount delay={0.28}>
              <span className="hero__positioning-line">
                Business
                <span className="hero__times" aria-hidden="true">
                  ×
                </span>
                <span className="sr-only"> and </span>
                Technology
                <span className="hero__times" aria-hidden="true">
                  ×
                </span>
                <span className="sr-only"> and </span>
                Impact
              </span>
            </MaskRevealOnMount>
          </p>

          {/* The name, enormous, running past both edges. */}
          <div className="hero__nameband">
            <h1 className="sr-only">
              {site.name} — {site.positioning}
            </h1>
            <MaskRevealOnMount delay={0.08} innerClassName="hero__name-inner">
              <motion.span
                className="hero__marquee"
                aria-hidden="true"
                style={reduced ? undefined : { x: nameX }}
              >
                {[0, 1].map((i) => (
                  <span className="hero__name" key={i}>
                    {site.name}
                    <span className="hero__name-dash">—</span>
                  </span>
                ))}
              </motion.span>
            </MaskRevealOnMount>
          </div>
        </motion.div>

        <div className="hero__baserail">
          <motion.span
            className="hero__cue"
            style={reduced ? undefined : { opacity: railOpacity }}
            aria-hidden="true"
          >
            <span className="mono">Scroll</span>
            <span className="hero__cue-line" />
          </motion.span>

          <p className="hero__context mono">{site.discipline}</p>
        </div>
      </div>
    </section>
  );
}
