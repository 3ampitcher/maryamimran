import { educationSorted, publishedRecognition } from '../../data/recognition';
import { Reveal } from '../Motion/Reveal';
import './Recognition.css';

/* ============================================================
   EDUCATION & RECOGNITION
   ------------------------------------------------------------
   Numbers, typography and spacing. No trophies, no medals, no
   certificate wall. `publishedRecognition` filters to verified
   entries only, so nothing unconfirmed can reach the page.
   ============================================================ */

export function Recognition() {
  return (
    <section className="section recognition ground-stone" aria-labelledby="recognition-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">10</span> Education &amp; Recognition
            </p>
          </div>
          <h2 id="recognition-heading" className="sr-only">
            Education and recognition
          </h2>
        </div>

        {/* --- Education --- */}
        <div className="recognition__education">
          {educationSorted.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06} className="edu">
              <p className="edu__year mono">{e.year}</p>
              <h3 className="edu__institution">{e.institution}</h3>
              <p className="edu__qualification">{e.qualification}</p>
              {e.detail?.length ? (
                <ul className="edu__detail">
                  {e.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </div>

        {/* --- Recognition --- */}
        <ul className="recognition__list">
          {publishedRecognition.map((r, i) => (
            <Reveal
              as="li"
              key={r.id}
              delay={Math.min(i * 0.05, 0.25)}
              className={`rec ${r.value ? 'rec--figure' : ''}`}
            >
              {r.value && <span className="rec__value">{r.value}</span>}
              <span className="rec__body">
                <span className="rec__title">{r.title}</span>
                {r.organization && <span className="rec__org">{r.organization}</span>}
                {r.detail && <span className="rec__detail">{r.detail}</span>}
              </span>
              <span className="rec__year mono">{r.year}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
