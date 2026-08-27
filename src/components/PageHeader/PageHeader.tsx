import { MaskReveal, Reveal } from '../Motion/Reveal';
import './PageHeader.css';

/* ============================================================
   PAGE HEADER
   The oversized title block that opens each category route.
   ============================================================ */

interface PageHeaderProps {
  index: string;
  title: string;
  disciplines?: readonly string[];
  blurb?: string;
  count?: number;
  kicker?: string;
}

export function PageHeader({
  index,
  title,
  disciplines,
  blurb,
  count,
  kicker = 'Work',
}: PageHeaderProps) {
  return (
    <header className="pagehead">
      <div className="shell">
        <div className="pagehead__meta">
          <p className="label">
            <span className="label__index">{index}</span> {kicker}
          </p>
          {count !== undefined && (
            <p className="label">{String(count).padStart(2, '0')} items</p>
          )}
        </div>

        <h1 className="pagehead__title">
          <MaskReveal>
            <span>{title}</span>
          </MaskReveal>
        </h1>

        {disciplines && (
          <Reveal delay={0.1}>
            <p className="pagehead__disciplines">
              {disciplines.map((d, i) => (
                <span key={d}>
                  {i > 0 && (
                    <span className="pagehead__sep" aria-hidden="true">
                      {' '}
                      ·{' '}
                    </span>
                  )}
                  {d}
                </span>
              ))}
            </p>
          </Reveal>
        )}

        {blurb && (
          <Reveal delay={0.15}>
            <p className="lede pagehead__blurb">{blurb}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
