/**
 * The one gesture the whole app exists for, in the one place both views use it.
 *
 * The carousel and the All Coffees menu arm a drag the same way, wait for the
 * same movement threshold, and report the same outcome — so a coffee behaves
 * identically whichever screen you reached for it on.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from './api'
import type { RecipeView } from './api'
import { dragImageFor } from './DragArt'

/** How far the cursor must travel, held down, before this counts as a drag. */
export const DRAG_THRESHOLD = 4

/** How long after a drag a click is ignored. A native drag swallows the
 *  pointer, and the stray click it can leave behind must not be read as
 *  "choose this coffee". */
const CLICK_DEADZONE = 600

export type Status = 'idle' | 'pouring' | 'served' | 'error'

/** Honours the operating system's "reduce motion" setting, live. */
export function usePrefersReducedMotion() {
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

export function useBrew(onNotice: (message: string) => void) {
  const [status, setStatus] = useState<Status>('idle')
  const pouring = useRef(false)
  const clickBlockedUntil = useRef(0)

  const spill = useCallback(
    async (recipe: RecipeView) => {
      if (pouring.current) return
      pouring.current = true
      clickBlockedUntil.current = performance.now() + CLICK_DEADZONE
      setStatus('pouring')
      await nextPaint()
      try {
        const outcome = await api.pour(recipe.id, dragImageFor(recipe.icon, recipe.accent))
        setStatus(outcome === 'dropped' ? 'served' : 'idle')
      } catch (err) {
        console.error('Rebrew: the drag failed to start —', err)
        setStatus('error')
        onNotice(String(err))
      } finally {
        clickBlockedUntil.current = performance.now() + CLICK_DEADZONE
        pouring.current = false
      }
    },
    [onNotice],
  )

  /**
   * Arms the drag, but waits for actual movement before starting it. Without
   * the threshold a plain click on the drink would open and immediately close a
   * native drag, which Windows reports as a successful drop — so the app would
   * claim it served a coffee that went nowhere, and leave a file behind.
   */
  const grab = useCallback(
    (e: React.PointerEvent<Element>, recipe: RecipeView) => {
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

      // Typed as a plain Event listener because `currentTarget` is only known
      // to be an Element here — the carousel hands over an SVG group and the
      // menu hands over a button.
      const onMove = (event: Event) => {
        const ev = event as PointerEvent
        // If capture was refused, a pointer-up outside the drink never reaches
        // us and it would stay armed — so trust the button state too.
        if (ev.buttons === 0) return disarm()
        if (Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y) < DRAG_THRESHOLD) return
        disarm()
        void spill(recipe)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', disarm)
      el.addEventListener('pointercancel', disarm)
    },
    [spill],
  )

  /** True while a click would really be the tail of a drag. */
  const draggedJustNow = useCallback(() => performance.now() < clickBlockedUntil.current, [])

  useEffect(() => {
    if (status !== 'served' && status !== 'error') return
    const t = setTimeout(() => setStatus('idle'), status === 'served' ? 1600 : 2400)
    return () => clearTimeout(t)
  }, [status])

  return { status, grab, draggedJustNow }
}

/** The line above the machine, wherever the machine is drawn. */
export function instructionFor(status: Status, idle: string) {
  switch (status) {
    case 'pouring':
      return 'Pouring… drop it into your AI chat.'
    case 'served':
      return 'Served. Send the message.'
    case 'error':
      return 'That did not pour. Try again.'
    default:
      return idle
  }
}
