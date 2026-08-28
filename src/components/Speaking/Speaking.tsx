import { speakingWork } from '../../data/work';
import { Figure } from '../Media/Figure';
import { Reveal } from '../Motion/Reveal';
import './Speaking.css';

/* ============================================================
   SPEAKING
   ------------------------------------------------------------
   A horizontal editorial gallery. This is a body of speaking and
   teaching experience — sessions, pitches, workshops — not a
   keynote-speaker page, so it's framed as a record rather than
   as a booking pitch.

   Scrolls horizontally on desktop and swipes on touch, using
   native overflow with scroll-snap. No carousel library.
   ============================================================ */

export function Speaking() {
  const items = speakingWork;
  if (items.length === 0) return null;

  return (
    <section className="section speaking" aria-labelledby="speaking-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">03</span> Speaking
            </p>
            <p className="label" aria-hidden="true">
              Swipe / scroll →
            </p>
          </div>
          <h2 id="speaking-heading" className="headline speaking__headline">
            Explaining things in rooms.
          </h2>
          <p className="lede">
            Sessions, pitches and workshops — mostly on AI, robotics, sustainability and
            building things while still at university.
          </p>
        </div>
      </div>

      <Reveal>
        <ul className="speaking__rail">
          {items.map((item) => (
            <li key={item.id} className="scard">
              {item.featuredMedia && (
                <Figure
                  media={item.featuredMedia}
                  label={item.title}
                  className="scard__figure"
                  sizes="(max-width: 767px) 78vw, 26vw"
                />
              )}
              <div className="scard__body">
                <p className="scard__meta mono">
                  <span>{item.year}</span>
                  <span className="scard__meta-sep" aria-hidden="true">
                    /
                  </span>
                  <span>{item.role}</span>
                </p>
                <h3 className="scard__title">{item.title}</h3>
                {item.organization && <p className="scard__org">{item.organization}</p>}
                <p className="scard__desc">{item.shortDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
