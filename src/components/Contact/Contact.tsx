import { leapLine, leapMode, site } from '../../data/site';
import { MaskReveal } from '../Motion/Reveal';
import './Contact.css';

/* ============================================================
   CONTACT
   ------------------------------------------------------------
   The site ends on ink. Text links only — no social icon wall.
   The Resume link is only rendered when site.resume.available is
   true, so a missing PDF never produces a dead link.
   ============================================================ */

export function Contact() {
  return (
    <section id="contact" className="section section--tall surface-dark contact" aria-labelledby="contact-heading">
      <div className="shell contact__inner">
        <div className="section-head__meta contact__meta">
          <p className="label">Contact</p>
          {leapMode && <p className="label label--accent">{leapLine}</p>}
        </div>

        <h2 id="contact-heading" className="contact__headline">
          <MaskReveal>
            <span>Let’s talk.</span>
          </MaskReveal>
        </h2>

        <div className="contact__body">
          <p className="lede contact__lede">
            If you’re building something interesting, working on a problem I should know
            about, hiring, collaborating, or just want to connect — reach out.
          </p>

          <ul className="contact__links">
            <li>
              <a className="contact__link" href={`mailto:${site.email}`}>
                <span className="contact__link-label mono">Email</span>
                <span className="contact__link-value">{site.email}</span>
              </a>
            </li>
            <li>
              <a
                className="contact__link"
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="contact__link-label mono">LinkedIn</span>
                <span className="contact__link-value">
                  /{site.links.linkedin.replace(/\/$/, '').split('/').pop()}
                  <span className="contact__arrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </a>
            </li>
            {site.links.substack && (
              <li>
                <a
                  className="contact__link"
                  href={site.links.substack}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="contact__link-label mono">Substack</span>
                  <span className="contact__link-value">
                    Writing
                    <span className="contact__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            )}
            {site.resume.available && (
              <li>
                <a
                  className="contact__link"
                  href={site.resume.path}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="contact__link-label mono">Resume</span>
                  <span className="contact__link-value">
                    PDF
                    <span className="contact__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
