import { useState } from 'react';
import { site } from '../../data/site';
import './Portrait.css';

/* ============================================================
   PORTRAIT
   ------------------------------------------------------------
   Two modes:

   A. fill  — the photograph *is* the surface. Absolutely
      positioned to cover its container, cropped outward from
      the focal point. This is the hero.

   B. frame — a photograph in the flow at a given aspect ratio,
      its lower edge dissolved into the ground so it never reads
      as a photo card. This is About.

   Serves WebP with a JPEG fallback, at the widths listed in
   site.portrait.widths, so a phone downloads ~19 KB rather than
   the full-size frame. Regenerate the set with `npm run images`.

   While a file is absent a composed stand-in renders instead, so
   the layout can be judged before the photography arrives.
   ============================================================ */

export const PORTRAIT_SRC = site.portrait.src;
export const PORTRAIT_ABOUT_SRC = site.portrait.aboutSrc;

/** "/a/b/name.jpg" -> "/a/b/name-800.webp" (largest width keeps the base name). */
function variant(src: string, width: number | null, ext: string) {
  const base = src.replace(/\.[^./]+$/, '');
  return width === null ? `${base}.${ext}` : `${base}-${width}.${ext}`;
}

function buildSrcSet(src: string, widths: readonly number[], ext: string) {
  const largest = Math.max(...widths);
  return widths
    .map((w) => `${variant(src, w === largest ? null : w, ext)} ${w}w`)
    .join(', ');
}

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
  /** Shown if `src` 404s — lets About fall back to the hero photograph. */
  fallbackSrc?: string;
  placeholderNote?: string;
}

export function Portrait({
  src = PORTRAIT_SRC,
  alt = `${site.name} — portrait`,
  ratio = '4 / 5',
  objectPosition = site.portrait.focus,
  className = '',
  priority = false,
  sizes = '100vw',
  fill = false,
  fallbackSrc,
  placeholderNote,
}: PortraitProps) {
  const [current, setCurrent] = useState(src);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading');

  /* Only the configured photograph has a generated responsive set; a
     fallback stands in as a plain src. The single-file build has no server
     to serve the variants, so it uses the one inlined source. */
  const hasSet =
    current === PORTRAIT_SRC && import.meta.env.VITE_STANDALONE !== 'true';
  const widths = site.portrait.widths;

  const onError = () => {
    if (fallbackSrc && current !== fallbackSrc) {
      setCurrent(fallbackSrc);
      return;
    }
    setStatus('missing');
  };

  return (
    <div
      className={`portrait portrait--${fill ? 'fill' : 'frame'} portrait--${status} ${className}`}
      style={fill ? undefined : { ['--portrait-ratio' as string]: ratio }}
    >
      {status !== 'missing' && (
        <picture>
          {hasSet && (
            <source type="image/webp" srcSet={buildSrcSet(current, widths, 'webp')} sizes={sizes} />
          )}
          <img
            key={current}
            className="portrait__img"
            src={current}
            srcSet={hasSet ? buildSrcSet(current, widths, 'jpg') : undefined}
            sizes={hasSet ? sizes : undefined}
            alt={alt}
            style={{ objectPosition }}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            // @ts-expect-error -- fetchpriority is valid HTML, not yet in React's types
            fetchpriority={priority ? 'high' : undefined}
            onLoad={() => setStatus('loaded')}
            onError={onError}
          />
        </picture>
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
