import { Link } from 'react-router-dom';
import { Portrait, PORTRAIT_ABOUT_SRC } from '../Portrait/Portrait';
import { MaskReveal, Reveal } from '../Motion/Reveal';
import { site } from '../../data/site';
import './About.css';

/* ============================================================
   ABOUT
   ------------------------------------------------------------
   Opens on a statement, not on a greeting. The second portrait
   is swapped in by dropping a file at PORTRAIT_ABOUT_SRC; until
   then the component falls back to the hero portrait so the
   layout is never broken by a missing asset.
   ============================================================ */

export function About() {
  return (
    <section className="section about" aria-labelledby="about-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">01</span> About
            </p>
            <p className="label">
              {site.location}
            </p>
          </div>
        </div>

        <div className="about__grid">
          <div className="about__lead">
            <h2 id="about-heading" className="about__opening">
              <MaskReveal>
                <span>I’ve always been drawn to people</span>
              </MaskReveal>
              <MaskReveal delay={0.08}>
                <span>who think something could be</span>
              </MaskReveal>
              <MaskReveal delay={0.16}>
                <span>better — and then actually</span>
              </MaskReveal>
              <MaskReveal delay={0.24}>
                <span>try to make it better.</span>
              </MaskReveal>
            </h2>
          </div>

          <Reveal delay={0.2} className="about__portrait-wrap">
            <Portrait
              src={PORTRAIT_ABOUT_SRC}
              ratio="4 / 5"
              objectPosition="center 26%"
              sizes="(max-width: 900px) 88vw, 38vw"
              alt={`${site.name} — portrait`}
              placeholderNote="About portrait → maryam-about.jpg"
            />
          </Reveal>

          <Reveal delay={0.1} className="about__body">
            <div className="prose about__prose">
              <p>
                I’m a {site.discipline} student at the {site.university} in {site.location},
                working across business, technology and impact.
              </p>
              <p>
                In practice that means building a startup and finding out what small business
                owners actually need, wiring sensors to a robot that has to physically work,
                and doing the unglamorous evidence work behind a university’s sustainability
                reporting. The through-line isn’t a discipline — it’s wanting to know how
                something works well enough to change it.
              </p>
              <p>
                I learn by building, testing, reading data, leading teams, speaking,
                researching and running experiments that sometimes don’t work. The breadth is
                deliberate. I’d rather find the edges of several things now than pick one
                early for the sake of a tidy story.
              </p>
              <p className="about__closing">I’m still early in all of this. That’s the exciting part.</p>
            </div>

            <div className="about__links">
              <Link to="/index" className="textlink">
                See everything
                <span className="textlink__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
              {site.resume.available && (
                <a
                  href={site.resume.path}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="textlink"
                >
                  Resume
                  <span className="textlink__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="textlink"
              >
                LinkedIn
                <span className="textlink__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
