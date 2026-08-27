import { useState } from 'react';
import type { MediaItem } from '../../data/types';
import './Figure.css';

/* ============================================================
   FIGURE — the whole asset system.
   ------------------------------------------------------------
   Points at a file under /public. If that file doesn't exist
   yet, the <img> errors and we render a neutral placeholder
   carrying the real project name instead. No stock photography,
   no Unsplash fillers, no visible "[ADD IMAGE]" strings.

   To add a real image: drop the file at the `src` path in the
   work data. Nothing else needs to change.
   ============================================================ */

interface FigureProps {
  media: MediaItem;
  /** The name shown on the placeholder while no file exists. */
  label?: string;
  className?: string;
  /** Above-the-fold images opt out of lazy loading. */
  priority?: boolean;
  /** Disables the 1.04 -> 1.00 entry scale (e.g. inside a parallax module). */
  noScale?: boolean;
  sizes?: string;
}

export function Figure({
  media,
  label,
  className = '',
  priority = false,
  noScale = false,
  sizes,
}: FigureProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'missing'>('loading');
  const ratio = media.ratio ?? '3/2';

  return (
    <figure
      className={`figure figure--${status} ${noScale ? 'figure--noscale' : ''} ${className}`}
      style={{ ['--figure-ratio' as string]: ratio.replace('/', ' / ') }}
    >
      <div className="figure__frame">
        {status !== 'missing' && (
          <img
            className="figure__img"
            src={media.src}
            alt={media.alt}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            // @ts-expect-error -- fetchpriority is valid HTML, not yet in React's types
            fetchpriority={priority ? 'high' : undefined}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('missing')}
          />
        )}

        {status === 'missing' && <Placeholder label={label ?? media.alt} />}
      </div>

      {media.caption && status !== 'missing' && (
        <figcaption className="figure__caption mono">{media.caption}</figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------
   The placeholder: stone field, hairline frame, the real name of
   the thing, and a small corner mark. Reads as intentional
   rather than broken.
   ------------------------------------------------------------ */

function Placeholder({ label }: { label: string }) {
  return (
    <div className="figph" role="img" aria-label={label}>
      <span className="figph__grid" aria-hidden="true" />
      <span className="figph__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2.5" y="4.5" width="19" height="15" />
          <path d="M2.5 15.5l5.5-4.5 4.5 3.5 3.5-2.5 5.5 4" />
          <circle cx="8" cy="9" r="1.4" />
        </svg>
      </span>
      <span className="figph__label">{label}</span>
    </div>
  );
}
