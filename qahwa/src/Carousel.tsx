import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from './api'
import type { Preset, RecipeView } from './api'
import CoffeeMachine from './CoffeeMachine'
import { CupArt, baselineOf } from './Cups'

/** How far the cursor must travel, held down, before this counts as a drag. */
const DRAG_THRESHOLD = 4

/* Placement of the cup inside the machine's 160x170 viewBox. The tray line is
   where every cup stands, whatever shape it is. */
const CUP_SCALE = 0.72
const CUP_X = 57
const TRAY_Y = 148

type Status = 'idle' | 'pouring' | 'served' | 'error'

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
  onInfo,
  onNotice,
}: {
  recipes: RecipeView[]
  index: number
  accents: Preset[]
  active: boolean
  onChoose: (next: number) => void
  onInfo: () => void
  onNotice: (message: string) => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const pouring = useRef(false)
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
      console.error('Qahwa: the drag failed to start —', err)
      setStatus('error')
      onNotice(String(err))
    } finally {
      pouring.current = false
    }
  }, [selected, onNotice])

  /**
   * Arms the drag, but waits for actual movement before starting it. Without
   * the threshold a plain click on the cup would open and immediately close a
   * native drag, which Windows reports as a successful drop — so the app would
   * claim it served a coffee that went nowhere, and leave a file behind.
   */
  const grabCup = useCallback(
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
        // If capture was refused, a pointer-up outside the cup never reaches
        // us and the cup would stay armed — so trust the button state too.
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
    return (
      <div className="empty">
        <p>No coffees on the menu.</p>
        <button className="btn" onClick={onInfo}>
          Open settings to add one
        </button>
      </div>
    )
  }

  const accent = api.accentHex(accents, selected.accent)

  return (
    <>
      {/* The machine and the cup are two SVGs sharing one viewBox and one
          preserveAspectRatio, so they letterbox identically and stay lined up
          at every window size. The cup layer covers the whole stage but is
          transparent to the pointer except over the cup itself — which is what
          keeps the drag on the cup and off everything else. */}
      <div className={`stage stage--${status}`}>
        <CoffeeMachine brewing={status === 'pouring'} />
        <svg
          className="cup-layer"
          viewBox="0 0 160 170"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <g
            key={selected.id}
            className="cup-grab"
            transform={`translate(${CUP_X} ${TRAY_Y - baselineOf(selected.icon) * CUP_SCALE}) scale(${CUP_SCALE})`}
            onPointerDown={grabCup}
            onDragStart={(e) => e.preventDefault()}
          >
            <title>Drag {selected.name} into your chat</title>
            {/* The lift lives on an inner group so the hover does not have to
                restate the per-cup placement above. */}
            <g className="cup-lift">
              {/* A comfortable grab target that still stops at the cup. */}
              <rect x="2" y="4" width="60" height="68" fill="transparent" />
              <CupArt icon={selected.icon} accent={accent} steaming={status === 'idle'} />
            </g>
          </g>
        </svg>
      </div>

      <div className="picker">
        <button
          className="picker__arrow"
          onClick={() => onChoose(index - 1)}
          title="Previous coffee"
          aria-label="Previous coffee"
          disabled={recipes.length < 2}
        >
          ‹
        </button>
        <div className="picker__label">
          <span className="picker__name">{selected.name}</span>
          <span className="picker__purpose">{selected.purpose}</span>
        </div>
        <button
          className="picker__arrow"
          onClick={() => onChoose(index + 1)}
          title="Next coffee"
          aria-label="Next coffee"
          disabled={recipes.length < 2}
        >
          ›
        </button>
      </div>

      {recipes.length > 1 && (
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
      )}

      <p className="explain">
        {status === 'pouring'
          ? 'Pouring… drop it in your chat.'
          : status === 'served'
            ? 'Served. Send the message.'
            : status === 'error'
              ? 'The cup slipped. Try again.'
              : selected.explanation}
      </p>
      <p className="hint">Choose a coffee. Drag the cup into your chat.</p>
    </>
  )
}
