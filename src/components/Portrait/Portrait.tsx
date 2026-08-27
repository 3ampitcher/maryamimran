import { useState } from 'react';
import { site } from '../../data/site';
import './Portrait.css';

/* ============================================================
   PORTRAIT
   ------------------------------------------------------------
   The reusable portrait component. The hero and the About page
   both use it; About can be swapped to a second image by
   changing `src` alone.

   Source file:  public/assets/portrait/maryam-portrait.jpg
   Second image: public/assets/portrait/maryam-about.jpg

   The source portrait is square. Rather than forcing an ugly
   crop, the frame takes a ratio and `objectPosition` keeps the
   face in the upper third as the frame gets taller.
   ============================================================ */

export const PORTRAIT_SRC = '/assets/portrait/maryam-portrait.jpg';
export const PORTRAIT_ABOUT_SRC = '/assets/portrait/maryam-about.jpg';

interface PortraitProps {
  src?: string;
  alt?: string;
  /** CSS aspect-ratio for the frame. */
  ratio?: string;
  /** Keeps the face placed as the frame changes shape. */
  objectPosition?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Caption shown under the placeholder only, guiding the file drop. */
  placeholderNote?: string;
}

export function Portrait({
  src = PORTRAIT_SRC,
  alt = `${site.name} — portrait`,
  ratio = '1 / 1',
  objectPosition = 'center 28%',
  className = '',
  priority = false,
  sizes,
  placeholderNote,
}: PortraitProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading');

  return (
    <div
      className={`portrait portrait--${status} ${className}`}
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
          <span className="portrait__ph-grid" aria-hidden="true" />
          <span className="portrait__ph-mono" aria-hidden="true">
            {site.initials}
          </span>
          <span className="portrait__ph-note mono">
            {placeholderNote ?? `Portrait → ${src.replace('/assets/portrait/', '')}`}
          </span>
        </div>
      )}
    </div>
  );
}
