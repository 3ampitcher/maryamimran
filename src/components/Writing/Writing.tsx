import { writingSorted } from '../../data/writing';
import { site } from '../../data/site';
import { MaskReveal, Reveal } from '../Motion/Reveal';
import './Writing.css';

/* ============================================================
   WRITING
   ------------------------------------------------------------
   Editorial and almost entirely typographic — no blog cards, no
   thumbnails. A pull-quote in a serif provides the one place on
   the site where a second typeface appears.

   Pieces with no `externalLink` render as plain text rather than
   as dead links.
   ============================================================ */

interface WritingProps {
  /** Home shows a selection; /writing shows everything. */
  limit?: number;
  showQuote?: boolean;
  heading?: string;
  sectionIndex?: string;
}

export function Writing({
  limit,
  showQuote = true,
  heading = 'Writing',
  sectionIndex = '08',
}: WritingProps) {
  const items = limit ? writingSorted.slice(0, limit) : writingSorted;
  const quote = writingSorted.find((w) => w.pullQuote);

  return (
    <section className="section writing" aria-labelledby="writing-heading">
      <div className="shell">
        <h2 id="writing-heading" className="sr-only">
          {heading}
        </h2>

        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">{sectionIndex}</span> {heading}
            </p>
            {site.links.substack && (
              <a
                href={site.links.substack}
                target="_blank"
                rel="noreferrer noopener"
                className="label textlink textlink--quiet"
              >
                Substack ↗
              </a>
            )}
          </div>
        </div>

        {/* The single serif moment on the site. */}
        {showQuote && quote?.pullQuote && (
          <Reveal className="writing__quote-wrap">
            <blockquote className="writing__quote">
              <p className="writing__quote-text">“{quote.pullQuote}”</p>
            </blockquote>
          </Reveal>
        )}

        <ul className="writing__list">
          {items.map((item, i) => {
            const Row = item.externalLink ? 'a' : 'div';
            const linkProps = item.externalLink
              ? {
                  href: item.externalLink,
                  target: '_blank',
                  rel: 'noreferrer noopener' as const,
                }
              : {};

            return (
              <li key={item.id} className="wrow">
                <Row className="wrow__inner" {...linkProps}>
                  <span className="wrow__meta">
                    <span className="wrow__date mono">{item.date}</span>
                    <span className="wrow__topic mono">{item.topic}</span>
                  </span>

                  <span className="wrow__main">
                    <MaskReveal delay={Math.min(i * 0.04, 0.2)}>
                      <span className="wrow__title">{item.title}</span>
                    </MaskReveal>
                    <span className="wrow__desc">{item.shortDescription}</span>
                  </span>

                  <span className="wrow__end">
                    {item.externalLink ? (
                      <span className="wrow__arrow" aria-hidden="true">
                        ↗
                      </span>
                    ) : (
                      item.platform && (
                        <span className="wrow__platform mono">{item.platform}</span>
                      )
                    )}
                  </span>
                </Row>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
