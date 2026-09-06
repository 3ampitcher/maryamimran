import { useEffect } from 'react'
import * as api from './api'
import type { Preset, RecipeView } from './api'
import CoffeeMachine from './CoffeeMachine'
import { DrinkArt, placementOf } from './Drinks'
import { instructionFor, useBrew, usePrefersReducedMotion } from './brew'

/* The tray line inside the machine's viewBox: where every drink stands,
   whatever shape it is. Each drink brings its own scale, so the sizes stay
   true to the drinks rather than to one shared zoom level. */
const TRAY_Y = 168
/** Invisible padding around a drink, in art units — about 12-16px on screen. */
const GRAB_PADDING = 9

export default function Carousel({
  recipes,
  index,
  accents,
  active,
  onChoose,
  onNotice,
}: {
  recipes: RecipeView[]
  index: number
  accents: Preset[]
  active: boolean
  onChoose: (next: number) => void
  onNotice: (message: string) => void
}) {
  const { status, grab } = useBrew(onNotice)
  const reducedMotion = usePrefersReducedMotion()
  const selected = recipes[index]

  // Left and right move through the menu, but never while someone is typing.
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      if (typing) return
      if (e.key === 'ArrowLeft') onChoose(index - 1)
      else if (e.key === 'ArrowRight') onChoose(index + 1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, index, onChoose])

  if (!selected) {
    return <div className="empty">No coffees on the menu.</div>
  }

  const accent = api.accentHex(accents, selected.accent)
  const place = placementOf(selected.icon)
  const instruction = instructionFor(status, 'Drag your coffee into an AI chat.')

  return (
    <>
      <p className={`instruct ${status === 'pouring' ? 'instruct--live' : ''}`}>{instruction}</p>

      <div className={`stage stage--${status}`}>
        <button
          className="arrow arrow--prev"
          onClick={() => onChoose(index - 1)}
          title="Previous coffee"
          aria-label="Previous coffee"
          disabled={recipes.length < 2}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* The machine and the drink are two SVGs sharing one viewBox and one
            preserveAspectRatio, so they letterbox identically and stay lined up
            at every window size. The drink layer covers the whole cell but is
            transparent to the pointer except over the drink itself — which is
            what keeps the drag on the drink and off everything else. */}
        <div className="rig">
          <CoffeeMachine brewing={status === 'pouring'} />
          <svg
            className="drink-layer"
            viewBox="0 0 160 186"
            preserveAspectRatio="xMidYMax meet"
            aria-hidden="true"
          >
            <g
              key={selected.id}
              className="drink-grab"
              transform={`translate(${80 - 32 * place.scale} ${TRAY_Y - place.base * place.scale}) scale(${place.scale})`}
              onPointerDown={(e) => grab(e, selected)}
              onDragStart={(e) => e.preventDefault()}
            >
              <title>Drag {selected.name} into your AI chat</title>
              <g className="drink-lift">
                {/* Padding out from what is actually visible, so a small
                    espresso is as easy to grab as a wide tumbler — without
                    reaching so far that the machine becomes draggable. */}
                <rect
                  x={place.box.x - GRAB_PADDING}
                  y={place.box.y - GRAB_PADDING}
                  width={place.box.w + GRAB_PADDING * 2}
                  height={place.box.h + GRAB_PADDING * 2}
                  fill="transparent"
                />
                <DrinkArt
                  icon={selected.icon}
                  accent={accent}
                  animated={!reducedMotion && status === 'idle'}
                />
              </g>
            </g>
          </svg>
        </div>

        <button
          className="arrow arrow--next"
          onClick={() => onChoose(index + 1)}
          title="Next coffee"
          aria-label="Next coffee"
          disabled={recipes.length < 2}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <h2 className="drink-name">{selected.name}</h2>
      <p className="drink-purpose">{selected.purpose}</p>
      <p className="drink-explain">{selected.explanation}</p>

      <div className="dots" role="tablist" aria-label="Coffee menu">
        {recipes.map((r, i) => (
          <button
            key={r.id}
            className={`dot ${i === index ? 'dot--on' : ''}`}
            role="tab"
            aria-selected={i === index}
            aria-label={r.name}
            title={r.name}
            onClick={() => onChoose(i)}
          />
        ))}
      </div>
    </>
  )
}
