import type { WorkItem } from '../../data/types';
import { Figure } from '../Media/Figure';
import { MaskReveal, Reveal } from '../Motion/Reveal';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { useIsMobile } from '../../hooks/useMediaQuery';
import './ImpactStack.css';

/* ============================================================
   IMPACT STACK — scrolling chapters
   ------------------------------------------------------------
   The third UX. Each chapter is a near-full-viewport panel that
   sticks while the next one scrolls up and covers it. This is
   done with position: sticky and nothing else — no scroll
   hijacking, no scroll library. The wheel does exactly what the
   visitor expects; only the paint order is choreographed.

   Under reduced motion, or on mobile, sticking is switched off
   and the chapters become strong sequential sections.
   ============================================================ */

export function ImpactStack({ items }: { items: WorkItem[] }) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const sticky = !reduced && !isMobile;

  return (
    <div className={`istack ${sticky ? 'istack--sticky' : ''}`}>
      {items.map((item, i) => {
        const metrics = (item.metrics ?? []).filter((m) => m.verified);
        /* GreenMetric and Literacy shift toward data rather than photography. */
        const dataLed = item.secondaryTags.includes('analyze');

        return (
          <section
            key={item.id}
            className={`ichapter ${dataLed ? 'ichapter--data' : ''} ${
              i % 2 === 1 ? 'ground-stone' : ''
            }`}
            style={{ ['--chapter-i' as string]: i }}
            aria-labelledby={`chapter-${item.id}`}
          >
            <div className="ichapter__panel">
              <div className="shell ichapter__inner">
                <div className="ichapter__lead">
                  <p className="label ichapter__num">
                    <span className="label__index">{String(i + 1).padStart(2, '0')}</span>
                    {item.role}
                  </p>

                  <h3 id={`chapter-${item.id}`} className="ichapter__title">
                    <MaskReveal>
                      <span>{item.title}</span>
                    </MaskReveal>
                  </h3>

                  {item.organization && (
                    <p className="ichapter__org mono">{item.organization}</p>
                  )}

                  <Reveal delay={0.1}>
                    <div className="prose ichapter__prose">
                      {(item.fullDescription ?? [item.shortDescription]).map((p, pi) => (
                        <p key={pi}>{p}</p>
                      ))}
                    </div>
                  </Reveal>

                  {item.contribution?.length ? (
                    <Reveal delay={0.15}>
                      <ul className="ichapter__list">
                        {item.contribution.map((c, ci) => (
                          <li key={ci} className="ichapter__list-item">
                            <span className="ichapter__list-num mono">
                              {String(ci + 1).padStart(2, '0')}
                            </span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  ) : null}

                  {metrics.length > 0 && (
                    <Reveal delay={0.2}>
                      <div className="ichapter__metrics">
                        {metrics.map((m) => (
                          <div key={m.label} className="ichapter__metric">
                            <span className="ichapter__metric-value">{m.value}</span>
                            <span className="label">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  )}

                  <div className="tag-row ichapter__tags">
                    {item.secondaryTags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ichapter__visual">
                  {dataLed ? (
                    <DataPanel item={item} />
                  ) : (
                    (item.images ?? (item.featuredMedia ? [item.featuredMedia] : []))
                      .slice(0, 2)
                      .map((img) => (
                        <Figure
                          key={img.src}
                          media={img}
                          label={item.title}
                          className="ichapter__figure"
                          sizes="(max-width: 767px) 92vw, 40vw"
                        />
                      ))
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------
   DATA PANEL — for the reporting chapters. A document fragment,
   not a fake SaaS dashboard: category rows with evidence status,
   set in mono, plus the real photography beneath it.
   ------------------------------------------------------------ */

const REPORTING_CATEGORIES = [
  'Setting & Infrastructure',
  'Energy & Climate Change',
  'Waste',
  'Water',
  'Transportation',
  'Education & Research',
];

function DataPanel({ item }: { item: WorkItem }) {
  const image = item.featuredMedia ?? item.images?.[0];

  return (
    <div className="dpanel">
      <div className="dpanel__doc">
        <p className="dpanel__doc-head label">Evidence categories</p>
        <ul className="dpanel__rows">
          {REPORTING_CATEGORIES.map((c, i) => (
            <li key={c} className="dpanel__row">
              <span className="dpanel__row-num mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="dpanel__row-name">{c}</span>
              <span className="dpanel__row-rule" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>

      {image && (
        <Figure media={image} label={item.title} className="dpanel__figure" sizes="40vw" />
      )}
    </div>
  );
}
