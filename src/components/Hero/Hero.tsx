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
   Face first. Person + typography + page as one composition,
   not a page with a photo card on it.

   Scroll choreography is deliberately quiet: the name lifts a
   little, softens, and settles back a fraction of a percent in
   scale. No horizontal travel — the name is a fixed part of the
   composition, and the motion is a second-order detail.
   ============================================================ */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* The name: a small lift, a gentle fade, a touch of scale.
     Nothing travels sideways. */
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-9%']);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.32]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.985]);

  /* The portrait rises very slightly faster, which is what makes
     the two feel like one composition rather than two layers. */
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '-13%']);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="hero" aria-label="Introduction">
      <div className="hero__ground" aria-hidden="true" />

      <div className="hero__inner">
        {/* --- Top rail --- */}
        <motion.div className="hero__rail" style={reduced ? undefined : { opacity: metaOpacity }}>
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

        {/* --- Composition: type and person share the same space --- */}
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
            style={reduced ? undefined : { y: portraitY }}
          >
            <Portrait
              priority
              cutout={site.portrait.cutout}
              ratio="4 / 5"
              objectPosition="center 22%"
              sizes="(max-width: 767px) 76vw, (max-width: 1200px) 40vw, 32vw"
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

        {/* --- The name. Static in the composition; it only breathes. --- */}
        <div className="hero__nameband">
          <h1 className="sr-only">
            {site.name} — {site.positioning}
          </h1>
          <motion.span
            className="hero__name"
            aria-hidden="true"
            style={reduced ? undefined : { y: nameY, opacity: nameOpacity, scale: nameScale }}
          >
            <MaskRevealOnMount delay={0.05} innerClassName="hero__name-inner">
              Maryam Imran
            </MaskRevealOnMount>
          </motion.span>
        </div>

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
