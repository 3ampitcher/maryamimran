import { educationSorted } from '../../data/recognition';
import { MaskReveal, Reveal } from '../Motion/Reveal';
import './Education.css';

/* ============================================================
   EDUCATION
   ------------------------------------------------------------
   Large editorial blocks, not résumé rows. The institution is
   set at display size; the qualification and results sit under
   it as a short stack.
   ============================================================ */

export function Education() {
  return (
    <section className="section education" aria-labelledby="education-heading">
      <div className="shell">
        <div className="section-head__meta education__meta">
          <h2 id="education-heading" className="label">
            Education
          </h2>
        </div>

        <div className="education__grid">
          {educationSorted.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08} className="edublock">
              <p className="edublock__year mono">{e.year}</p>

              <h3 className="edublock__institution">
                <MaskReveal delay={i * 0.08}>
                  <span>{e.short ?? e.institution}</span>
                </MaskReveal>
              </h3>

              <p className="edublock__qualification">{e.qualification}</p>

              {e.results?.length ? (
                <ul className="edublock__results">
                  {e.results.map((r) => (
                    <li key={r.label} className="edublock__result">
                      <span className="edublock__result-label">{r.label}</span>
                      <span className="edublock__result-value">{r.value}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {e.detail?.length ? (
                <p className="edublock__detail">{e.detail.join(' · ')}</p>
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
