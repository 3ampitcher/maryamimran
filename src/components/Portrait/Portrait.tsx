import { useState } from 'react';
import { site } from '../../data/site';
import './Portrait.css';

/* ============================================================
   PORTRAIT
   ------------------------------------------------------------
   Two treatments, both designed to sit *in* the page rather than
   on top of it:

   A. cutout (preferred) — a transparent PNG of Maryam placed
      directly on the stone. No frame, no ground, no edge. The
      person and the typography share one surface.

   B. frame (fallback)   — a normal rectangular photograph, with
      its lower edge dissolved into the ground by a mask so it
      never reads as a pasted-on photo card.

   Which one is used is set once, in site.ts → portrait.cutout.

   Files:
     public/assets/portrait/maryam-portrait.jpg   (or .png cutout)
     public/assets/portrait/maryam-about.jpg
   ============================================================ */

export const PORTRAIT_SRC = site.portrait.src;
export const PORTRAIT_ABOUT_SRC = site.portrait.aboutSrc;

interface PortraitProps {
  src?: string;
  alt?: string;
  ratio?: string;
  objectPosition?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Transparent PNG placed straight on the ground — no frame at all. */
  cutout?: boolean;
  placeholderNote?: string;
}

export function Portrait({
  src = PORTRAIT_SRC,
  alt = `${site.name} — portrait`,
  ratio = '1 / 1',
  objectPosition = 'center 24%',
  className = '',
  priority = false,
  sizes,
  cutout = false,
  placeholderNote,
}: PortraitProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading');

  return (
    <div
      className={`portrait portrait--${cutout ? 'cutout' : 'frame'} portrait--${status} ${className}`}
      style={{ ['--portrait-ratio' as string]: ratio }}
    >
      {status !== 'missing' && (
        <img
          className="portrait__img"
          src={src}
          alt={alt}
          sizes={sizes}
          style={{ objectPosition }}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // @ts-expect-error -- fetchpriority is valid HTML, not yet in React's types
          fetchpriority={priority ? 'high' : undefined}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('missing')}
        />
      )}

      {status === 'missing' && (
        <div className="portrait__ph" role="img" aria-label={alt}>
          <span className="portrait__ph-mono" aria-hidden="true">
            {site.initials}
          </span>
          <span className="portrait__ph-note mono">
            {placeholderNote ?? src.replace('/assets/portrait/', '')}
          </span>
        </div>
      )}
    </div>
  );
}
