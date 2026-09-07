/**
 * The whole menu at once: the four coffees on a serving tray.
 *
 * Not a settings screen and not a list — the tray is the machine's own drip
 * tray widened out, so the drinks still read as something that was poured
 * rather than a menu of options. Every cup on it drags into an AI chat exactly
 * as the one on the carousel does; a plain click chooses it and hands the
 * window back to the carousel.
 */
import * as api from './api'
import type { Preset, RecipeView } from './api'
import Drink from './Drinks'
import { instructionFor, useBrew, usePrefersReducedMotion } from './brew'

export default function AllCoffees({
  recipes,
  index,
  accents,
  onPick,
  onNotice,
}: {
  recipes: RecipeView[]
  index: number
  accents: Preset[]
  /** Chooses a coffee and goes back to the carousel. */
  onPick: (next: number) => void
  onNotice: (message: string) => void
}) {
  const { status, grab, draggedJustNow } = useBrew(onNotice)
  const reducedMotion = usePrefersReducedMotion()

  if (recipes.length === 0) {
    return <div className="empty">No coffees on the menu.</div>
  }

  const instruction = instructionFor(status, 'Drag any coffee into an AI chat.')

  return (
    <>
      <p className={`instruct ${status === 'pouring' ? 'instruct--live' : ''}`}>{instruction}</p>

      <div className={`menu menu--${status}`}>
        <div className="tray" role="group" aria-label="All coffees">
          {recipes.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`cup ${i === index ? 'cup--on' : ''}`}
              aria-pressed={i === index}
              title={`Drag ${r.name} into your AI chat, or click to choose it`}
              aria-label={`${r.name}, ${r.purpose}. Drag it into your AI chat, or select it.`}
              onPointerDown={(e) => grab(e, r)}
              onDragStart={(e) => e.preventDefault()}
              onClick={() => {
                // A native drag can leave a click behind it. That is the tail
                // of the drag, not someone choosing this coffee.
                if (!draggedJustNow()) onPick(i)
              }}
            >
              <Drink
                icon={r.icon}
                accent={api.accentHex(accents, r.accent)}
                animated={!reducedMotion && status === 'idle'}
                className="cup__drink"
              />
              <span className="cup__name">{r.name}</span>
              <span className="cup__purpose">{r.purpose}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
