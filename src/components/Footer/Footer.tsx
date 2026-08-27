import { Link } from 'react-router-dom';
import { site } from '../../data/site';
import './Footer.css';

/* ============================================================
   FOOTER
   Continues the ink ground from Contact. Quiet, structural.
   ============================================================ */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <p className="footer__name">{site.name}</p>
          <p className="footer__positioning mono">{site.positioning}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          <ul className="footer__list">
            <li>
              <Link className="textlink textlink--quiet" to="/business">
                Business
              </Link>
            </li>
            <li>
              <Link className="textlink textlink--quiet" to="/technology">
                Technology
              </Link>
            </li>
            <li>
              <Link className="textlink textlink--quiet" to="/impact">
                Impact
              </Link>
            </li>
            <li>
              <Link className="textlink textlink--quiet" to="/index">
                Index
              </Link>
            </li>
            <li>
              <Link className="textlink textlink--quiet" to="/writing">
                Writing
              </Link>
            </li>
            <li>
              <Link className="textlink textlink--quiet" to="/about">
                About
              </Link>
            </li>
          </ul>
        </nav>

        <div className="footer__end">
          <p className="footer__meta mono">
            {site.location} · {site.domain}
          </p>
          <p className="footer__meta mono">© {year}</p>
        </div>
      </div>
    </footer>
  );
}
