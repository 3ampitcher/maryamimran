import type { WorkItem } from '../../data/types';
import { Figure } from '../Media/Figure';
import './WorkRecord.css';

/* ============================================================
   WORK RECORD
   ------------------------------------------------------------
   The expanded body of a work item. Rendered in place inside an
   index row — items are not sent off to a generic detail page.

   Every block is conditional: an item with no metrics, images or
   phases simply renders less. Unverified metrics never appear.
   ============================================================ */

export function WorkRecord({ item }: { item: WorkItem }) {
  const metrics = (item.metrics ?? []).filter((m) => m.verified);
  const images = item.images ?? [];
  const links = (item.externalLinks ?? []).filter((l) => l.href);

  return (
    <div className="record">
      <div className="record__grid">
        {/* --- Left rail: the facts --- */}
        <div className="record__facts">
          {item.organization && (
            <div className="record__fact">
              <span className="label">Where</span>
              <span className="record__fact-value">{item.organization}</span>
            </div>
          )}
          <div className="record__fact">
            <span className="label">Role</span>
            <span className="record__fact-value">{item.role}</span>
          </div>
          <div className="record__fact">
            <span className="label">Year</span>
            <span className="record__fact-value mono">{item.date ?? item.year}</span>
          </div>
          <div className="record__fact">
            <span className="label">Tags</span>
            <span className="tag-row record__tags">
              <span className="tag tag--primary">{item.primaryCategory}</span>
              {item.secondaryTags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* --- Main column --- */}
        <div className="record__main">
          {item.fullDescription?.length ? (
            <div className="prose record__prose">
              {item.fullDescription.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : (
            <p className="prose record__prose">{item.shortDescription}</p>
          )}

          {item.contribution?.length ? (
            <div className="record__block">
              <h4 className="label record__block-title">What I did</h4>
              <ul className="record__list">
                {item.contribution.map((c, i) => (
                  <li key={i} className="record__list-item">
                    <span className="record__bullet" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* --- Iteration, shown as progression --- */}
          {item.phases?.length ? (
            <div className="record__block">
              <h4 className="label record__block-title">How it evolved</h4>
              <ol className="record__phases">
                {item.phases.map((phase, i) => (
                  <li key={phase.label} className="record__phase">
                    <span className="record__phase-num mono">{String(i + 1).padStart(2, '0')}</span>
                    <span className="record__phase-label">{phase.label}</span>
                    {phase.note && <span className="record__phase-note">{phase.note}</span>}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {/* --- Verified metrics only --- */}
          {metrics.length > 0 && (
            <div className="record__metrics">
              {metrics.map((m) => (
                <div key={m.label} className="record__metric">
                  <span className="record__metric-value">{m.value}</span>
                  <span className="record__metric-label label">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {item.result && (
            <div className="record__result">
              <span className="label">Result</span>
              <span className="record__result-value">{item.result}</span>
            </div>
          )}

          {links.length > 0 && (
            <div className="record__links">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="textlink textlink--quiet"
                >
                  {l.label}
                  <span className="textlink__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Media --- */}
      {images.length > 0 && (
        <div className="record__media">
          {images.map((img) => (
            <Figure key={img.src} media={img} label={item.title} className="record__figure" />
          ))}
        </div>
      )}
    </div>
  );
}
