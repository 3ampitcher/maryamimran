import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavGround } from '../../hooks/useNavGround';
import { site } from '../../data/site';
import './Navigation.css';

/* ============================================================
   NAVIGATION
   ------------------------------------------------------------
   Minimal, fixed, editorial. Not a SaaS navbar: no pill buttons,
   no logo lockup, no drop shadow. A cobalt dot marks the current
   route. On mobile it collapses to a full-screen menu.
   ============================================================ */

const links = [
  { label: 'Work', to: '/business' },
  { label: 'Index', to: '/index' },
  { label: 'Writing', to: '/writing' },
  { label: 'About', to: '/about' },
];

const workLinks = [
  { label: 'Business', to: '/business' },
  { label: 'Technology', to: '/technology' },
  { label: 'Impact', to: '/impact' },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const ground = useNavGround();

  /* Close on route change. */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /* Condense the bar once the hero is behind us. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Escape closes the menu and returns focus to the toggle. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isWorkRoute = workLinks.some((l) => l.to === location.pathname);

  return (
    <header
      className={`nav ${scrolled ? 'nav--scrolled' : ''} ${ground.dark ? 'nav--ondark' : ''}`}
      style={{ ['--nav-ground' as string]: ground.color }}
    >
      <div className="nav__inner">
        <Link to="/" className="nav__name" aria-label={`${site.name} — home`}>
          <span className="nav__name-full">{site.name}</span>
          <span className="nav__name-short" aria-hidden="true">
            {site.initials}
          </span>
        </Link>

        {/* --- Desktop --- */}
        <nav className="nav__links" aria-label="Primary">
          <ul className="nav__list">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav__link ${
                      isActive || (link.label === 'Work' && isWorkRoute) ? 'nav__link--active' : ''
                    }`
                  }
                >
                  <span className="nav__dot" aria-hidden="true" />
                  {link.label}
                </NavLink>
              </li>
            ))}
            {/* Rendered only once the PDF exists — see site.resume.available. */}
            {site.resume.available && (
              <li>
                <a
                  className="nav__link"
                  href={site.resume.path}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <span className="nav__dot" aria-hidden="true" />
                  Resume
                </a>
              </li>
            )}
            <li>
              <Link to="/#contact" className="nav__link">
                <span className="nav__dot" aria-hidden="true" />
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* --- Mobile toggle --- */}
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span className={`nav__toggle-glyph ${open ? 'is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Sub-navigation between the three work categories. */}
      {isWorkRoute && (
        <div className="nav__sub">
          <ul className="nav__sub-list">
            {workLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav__sub-link ${isActive ? 'nav__sub-link--active' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Mobile panel --- */}
      <div
        id="nav-menu"
        ref={panelRef}
        className={`navmenu ${open ? 'navmenu--open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="navmenu__list">
            {workLinks.map((link, i) => (
              <li key={link.to} style={{ ['--i' as string]: i }}>
                <Link to={link.to} className="navmenu__link">
                  <span className="navmenu__num mono">0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
            {links
              .filter((l) => l.label !== 'Work')
              .map((link, i) => (
                <li key={link.to} style={{ ['--i' as string]: i + 3 }}>
                  <Link to={link.to} className="navmenu__link">
                    <span className="navmenu__num mono">0{i + 4}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="navmenu__foot">
          <a href={site.links.linkedin} target="_blank" rel="noreferrer noopener" className="textlink textlink--quiet">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="textlink textlink--quiet">
            Email
          </a>
          {site.resume.available && (
            <a
              href={site.resume.path}
              target="_blank"
              rel="noreferrer noopener"
              className="textlink textlink--quiet"
            >
              Resume
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
