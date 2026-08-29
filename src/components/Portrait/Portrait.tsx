import { useState } from 'react';
import { site } from '../../data/site';
import './Portrait.css';

/* ============================================================
   PORTRAIT
   ------------------------------------------------------------
   Two modes:

   A. fill  — the photograph *is* the surface. Absolutely
      positioned to cover its container, cropped from the focal
      point outward. This is the hero.

   B. frame — a normal photograph in the flow, at a given aspect
      ratio, with its lower edge dissolved into the ground so it
      never reads as a photo card. This is About.

   Files:
     public/assets/portrait/maryam-portrait.jpg   (hero, landscape)
     public/assets/portrait/maryam-about.jpg      (About, optional)

   While a file is absent the component renders a composed
   stand-in rather than a broken image, so the layout can be
   judged before the photography arrives.
   ============================================================ */

export const PORTRAIT_SRC = site.portrait.src;
export const PORTRAIT_ABOUT_SRC = site.portrait.aboutSrc;

interface PortraitProps {
  src?: string;
  alt?: string;
  /** frame mode only. */
  ratio?: string;
  /** Focal point, "x% y%". Defaults to the one in site.ts. */
  objectPosition?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Cover the container absolutely instead of sitting in the flow. */
  fill?: boolean;
  placeholderNote?: string;
}

export function Portrait({
  src = PORTRAIT_SRC,
  alt = `${site.name} — portrait`,
  ratio = '4 / 5',
  objectPosition = site.portrait.focus,
  className = '',
  priority = false,
  sizes,
  fill = false,
  placeholderNote,
}: PortraitProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading');

  return (
    <div
      className={`portrait portrait--${fill ? 'fill' : 'frame'} portrait--${status} ${className}`}
      style={fill ? undefined : { ['--portrait-ratio' as string]: ratio }}
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
            {placeholderNote ?? `Photograph → ${src.replace('/assets/portrait/', '')}`}
          </span>
        </div>
      )}
    </div>
  );
}
