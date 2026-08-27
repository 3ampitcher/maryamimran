import { useState } from 'react';
import { workById } from '../../data/work';
import { Reveal } from '../Motion/Reveal';
import { useHasHover } from '../../hooks/useMediaQuery';
import './CrossDisciplinary.css';

/* ============================================================
   CROSS-DISCIPLINARY
   ------------------------------------------------------------
   An animated typographic map rather than a Venn diagram. Each
   entry is a real work item positioned by the disciplines it
   actually spans; hovering an axis lights up everything that
   touches it.

   Work is referenced by id from work.ts — nothing is restated.
   ============================================================ */

type Axis = 'business' | 'technology' | 'impact';

interface Intersection {
  workId: string;
  axes: Axis[];
  /** Extra descriptor beyond the three axes, e.g. "Speaking". */
  extra?: string[];
}

const intersections: Intersection[] = [
  { workId: 'tiin', axes: ['business', 'technology'] },
  { workId: 'vita', axes: ['technology', 'impact'] },
  { workId: 'ui-greenmetric', axes: ['impact', 'business'], extra: ['Analytics'] },
  { workId: 'agentic-ai', axes: ['technology'], extra: ['Speaking'] },
  { workId: 'think-sustainability', axes: ['impact', 'business'], extra: ['Leadership', 'Building'] },
  { workId: 'sustainability-literacy', axes: ['impact'], extra: ['Analytics', 'Research'] },
  { workId: 'food-gala', axes: ['business'], extra: ['Operations'] },
  { workId: 'tks', axes: ['technology'], extra: ['Research'] },
];

const axisLabel: Record<Axis, string> = {
  business: 'Business',
  technology: 'Technology',
  impact: 'Impact',
};

export function CrossDisciplinary() {
  const [activeAxis, setActiveAxis] = useState<Axis | null>(null);
  const hasHover = useHasHover();

  return (
    <section className="section section--tall xdisc ground-stone" aria-labelledby="xdisc-heading">
      <div className="shell">
        <div className="section-head">
          <div className="section-head__meta">
            <p className="label">
              <span className="label__index">06</span> Overlap
            </p>
            <p className="label">Most of it sits in more than one place</p>
          </div>
          <h2 id="xdisc-heading" className="headline xdisc__headline">
            The interesting work refuses to sit in one column.
          </h2>
        </div>

        {/* Axis selector — also the legend. */}
        <div className="xdisc__axes" role="group" aria-label="Filter the map by discipline">
          {(Object.keys(axisLabel) as Axis[]).map((axis) => (
            <button
              key={axis}
              type="button"
              className={`xdisc__axis xdisc__axis--${axis} ${
                activeAxis === axis ? 'xdisc__axis--on' : ''
              }`}
              aria-pressed={activeAxis === axis}
              onClick={() => setActiveAxis(activeAxis === axis ? null : axis)}
              onMouseEnter={() => hasHover && setActiveAxis(axis)}
              onMouseLeave={() => hasHover && setActiveAxis(null)}
            >
              {axisLabel[axis]}
            </button>
          ))}
        </div>

        <ul className={`xdisc__map ${activeAxis ? 'xdisc__map--filtered' : ''}`}>
          {intersections.map((entry, i) => {
            const item = workById(entry.workId);
            if (!item) return null;

            const on = !activeAxis || entry.axes.includes(activeAxis);
            const parts = [...entry.axes.map((a) => axisLabel[a]), ...(entry.extra ?? [])];

            return (
              <Reveal
                as="li"
                key={entry.workId}
                delay={i * 0.05}
                className={`xnode ${on ? '' : 'xnode--off'} xnode--span${entry.axes.length}`}
              >
                <span className="xnode__title">{item.title}</span>
                <span className="xnode__formula">
                  {parts.map((p, pi) => (
                    <span key={p} className="xnode__part">
                      {pi > 0 && (
                        <span className="xnode__times" aria-hidden="true">
                          ×
                        </span>
                      )}
                      {p}
                    </span>
                  ))}
                </span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
