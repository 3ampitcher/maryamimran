import { now } from '../../data/site';
import { Reveal } from '../Motion/Reveal';
import './Now.css';

/* ============================================================
   NOW
   ------------------------------------------------------------
   Time-sensitive by design. Everything here lives in
   src/data/site.ts under `now` — edit that and this section
   updates. Nothing structural depends on any single entry, so
   LEAP can come and go without touching the page.
   ============================================================ */

export function Now() {
  return (
    <section className="section now" aria-labelledby="now-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">11</span> Now
            </p>
            <p className="label">Updated {now.updated}</p>
          </div>
          <h2 id="now-heading" className="headline now__headline">
            What I’m doing at the moment.
          </h2>
        </div>

        <ul className="now__list">
          {now.items.map((item, i) => (
            <Reveal as="li" key={item.label} delay={i * 0.05} className="nowrow">
              <span className="nowrow__label">{item.label}</span>
              <span className="nowrow__text">{item.text}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
