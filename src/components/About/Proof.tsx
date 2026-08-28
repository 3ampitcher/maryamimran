import { publishedRecognition } from '../../data/recognition';
import { Reveal } from '../Motion/Reveal';
import './Proof.css';

/* ============================================================
   SELECTED RECOGNITION
   ------------------------------------------------------------
   A small number of large typographic proof moments — the
   figure set at display size, the thing it refers to underneath.
   No trophies, no medals, no certificate wall.

   Only entries with verified: true reach this component
   (publishedRecognition filters them out first), so nothing
   unconfirmed can appear. Entries with no figure are listed
   quietly below the proof moments rather than being inflated
   into one.
   ============================================================ */

export function Proof() {
  const figures = publishedRecognition.filter((r) => r.value);
  const rest = publishedRecognition.filter((r) => !r.value);

  if (publishedRecognition.length === 0) return null;

  return (
    <section className="section proof ground-stone" aria-labelledby="proof-heading">
      <div className="shell">
        <div className="section-head__meta proof__meta">
          <h2 id="proof-heading" className="label">
            Selected recognition
          </h2>
        </div>

        {figures.length > 0 && (
          <ul className="proof__figures">
            {figures.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 0.07} className="pfig">
                <span className="pfig__value">{r.value}</span>
                <span className="pfig__title">{r.title}</span>
                {r.organization && <span className="pfig__org">{r.organization}</span>}
                <span className="pfig__year mono">{r.year}</span>
              </Reveal>
            ))}
          </ul>
        )}

        {rest.length > 0 && (
          <ul className="proof__rest">
            {rest.map((r) => (
              <li key={r.id} className="prest">
                <span className="prest__title">{r.title}</span>
                {r.organization && <span className="prest__org">{r.organization}</span>}
                <span className="prest__year mono">{r.year}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
