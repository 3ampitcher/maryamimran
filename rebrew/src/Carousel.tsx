import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from './api'
import type { Preset, RecipeView } from './api'
import CoffeeMachine from './CoffeeMachine'
import { DrinkArt, placementOf } from './Drinks'

/** How far the cursor must travel, held down, before this counts as a drag. */
const DRAG_THRESHOLD = 4

/* The tray line inside the machine's viewBox: where every drink stands,
   whatever shape it is. Each drink brings its own scale, so the sizes stay
   true to the drinks rather than to one shared zoom level. */
const TRAY_Y = 168
/** Invisible padding around a drink, in art units — about 12-16px on screen. */
const GRAB_PADDING = 9

type Status = 'idle' | 'pouring' | 'served' | 'error'

/** Honours the operating system's "reduce motion" setting, live. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )
  useEffect(() => {
    const q = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!q) return
    const on = () => setReduced(q.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return reduced
}

/**
 * Resolves once the browser has had a chance to paint. On Windows the native
 * drag blocks the main thread for its whole duration, so the "pouring" frame
 * has to land before we hand the thread over — but a web view can throttle
 * animation frames, and a drag that never starts is far worse than one that
 * starts a frame early. Hence the timeout.
 */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    requestAnimationFrame(() => requestAnimationFrame(finish))
    setTimeout(finish, 50)
  })
}

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
  const [status, setStatus] = useState<Status>('idle')
  const pouring = useRef(false)
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

  const spill = useCallback(async () => {
    if (pouring.current || !selected) return
    pouring.current = true
    setStatus('pouring')
    await nextPaint()
    try {
      const outcome = await api.pour(selected.id)
      setStatus(outcome === 'dropped' ? 'served' : 'idle')
    } catch (err) {
      console.error('Rebrew: the drag failed to start —', err)
      setStatus('error')
      onNotice(String(err))
    } finally {
      pouring.current = false
    }
  }, [selected, onNotice])

  /**
   * Arms the drag, but waits for actual movement before starting it. Without
   * the threshold a plain click on the drink would open and immediately close a
   * native drag, which Windows reports as a successful drop — so the app would
   * claim it served a coffee that went nowhere, and leave a file behind.
   */
  const grabDrink = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (e.button !== 0 || pouring.current) return
      // Stop the web view starting its own (useless) HTML5 drag.
      e.preventDefault()

      const el = e.currentTarget
      const id = e.pointerId
      const origin = { x: e.clientX, y: e.clientY }

      try {
        el.setPointerCapture(id)
      } catch {
        /* capture is a nicety; the listeners below work either way */
      }

      const disarm = () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', disarm)
        el.removeEventListener('pointercancel', disarm)
        // Release before the native drag begins: it takes the mouse capture
        // itself and should not have to fight the web view for it.
        if (el.hasPointerCapture(id)) el.releasePointerCapture(id)
      }

      const onMove = (ev: PointerEvent) => {
        // If capture was refused, a pointer-up outside the drink never reaches
        // us and it would stay armed — so trust the button state too.
        if (ev.buttons === 0) return disarm()
        if (Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y) < DRAG_THRESHOLD) return
        disarm()
        void spill()
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', disarm)
      el.addEventListener('pointercancel', disarm)
    },
    [spill],
  )

  useEffect(() => {
    if (status !== 'served' && status !== 'error') return
    const t = setTimeout(() => setStatus('idle'), status === 'served' ? 1600 : 2400)
    return () => clearTimeout(t)
  }, [status])

  if (!selected) {
    return <div className="empty">No coffees on the menu.</div>
  }

  const accent = api.accentHex(accents, selected.accent)
  const place = placementOf(selected.icon)
  const instruction =
    status === 'pouring'
      ? 'Pouring… drop it into your AI chat.'
      : status === 'served'
        ? 'Served. Send the message.'
        : status === 'error'
          ? 'That did not pour. Try again.'
          : 'Drag your coffee into an AI chat.'

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
              onPointerDown={grabDrink}
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
