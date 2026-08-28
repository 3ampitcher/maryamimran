import { site } from '../../data/site';
import './ResumeBlock.css';

/* ============================================================
   RESUME
   ------------------------------------------------------------
   Renders only when the PDF is actually in place
   (site.resume.available), so About never shows a link that
   404s. Drop the file in public/resume/ and flip the flag.
   ============================================================ */

export function ResumeBlock() {
  if (!site.resume.available) return null;

  return (
    <section className="resumeblock" aria-labelledby="resume-heading">
      <div className="shell resumeblock__inner">
        <h2 id="resume-heading" className="label">
          Resume
        </h2>

        <a
          className="resumeblock__link"
          href={site.resume.path}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="resumeblock__label">Download PDF</span>
          <span className="resumeblock__arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
