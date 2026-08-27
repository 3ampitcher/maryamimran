import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta({
    title: 'Not found — Maryam Imran',
    description: 'This page does not exist.',
    path: '/404',
  });

  return (
    <section className="section section--tall" style={{ paddingTop: 'calc(var(--nav-h) + 6rem)' }}>
      <div className="shell">
        <p className="label">
          <span className="label__index">404</span> Not found
        </p>
        <h1 className="display" style={{ marginBlock: '1.5rem 2rem' }}>
          Nothing here.
        </h1>
        <p className="lede" style={{ marginBottom: '2rem' }}>
          That page doesn’t exist. The full archive probably has what you were looking for.
        </p>
        <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
          <Link to="/" className="textlink">
            Home
          </Link>
          <Link to="/index" className="textlink">
            Index
          </Link>
        </div>
      </div>
    </section>
  );
}
