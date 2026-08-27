import { Link } from 'react-router-dom';
import { indexWork } from '../../data/work';
import { MaskReveal } from '../Motion/Reveal';
import './IndexTeaser.css';

/* ============================================================
   INDEX TEASER
   The doorway on the home page into the full archive.
   ============================================================ */

export function IndexTeaser() {
  return (
    <section className="section indexteaser" aria-labelledby="indexteaser-heading">
      <div className="shell">
        <Link to="/index" className="indexteaser__link">
          <p className="label indexteaser__label">
            <span className="label__index">11</span> The archive
          </p>

          <h2 id="indexteaser-heading" className="indexteaser__headline">
            <MaskReveal>
              <span>
                Everything<span className="indexteaser__dot">.</span>
              </span>
            </MaskReveal>
          </h2>

          <p className="indexteaser__sub">
            Projects, roles, programs, talks, writing, competitions and things I’ve worked on.
          </p>

          <span className="indexteaser__cta">
            <span className="indexteaser__count mono">
              {String(indexWork.length).padStart(2, '0')} entries
            </span>
            <span className="indexteaser__arrow" aria-hidden="true">
              ↗
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
