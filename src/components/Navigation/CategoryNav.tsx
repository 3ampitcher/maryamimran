import { Link } from 'react-router-dom';
import { categoryMeta } from '../../data/work';
import type { Category } from '../../data/types';
import './CategoryNav.css';

/* ============================================================
   CATEGORY NAV
   The move between Business / Technology / Impact at the foot of
   each category route. Large type, not pagination arrows.
   ============================================================ */

const order: Category[] = ['business', 'technology', 'impact'];

export function CategoryNav({ current }: { current: Category }) {
  const others = order.filter((c) => c !== current);

  return (
    <nav className="catnav ground-stone" aria-label="Other work categories">
      <div className="shell">
        <p className="label catnav__label">Keep going</p>
        <ul className="catnav__list">
          {others.map((c) => {
            const meta = categoryMeta[c];
            return (
              <li key={c}>
                <Link to={meta.path} className="catnav__link">
                  <span className="catnav__index mono">{meta.index}</span>
                  <span className="catnav__title">{meta.title}</span>
                  <span className="catnav__arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link to="/index" className="catnav__link">
              <span className="catnav__index mono">—</span>
              <span className="catnav__title">Everything</span>
              <span className="catnav__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
