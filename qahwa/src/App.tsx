import { useCallback, useEffect, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import CoffeeMachine from './CoffeeMachine'
import Cup from './Cup'
import Disclaimer from './Disclaimer'

type PourOutcome = 'dropped' | 'cancelled'
type Status = 'idle' | 'pouring' | 'served' | 'error'

const SEEN_DISCLAIMER = 'qahwa.disclaimer.v1'

/** How far the cursor must travel, held down, before this counts as a drag. */
const DRAG_THRESHOLD = 4

const CAPTION: Record<Status, string> = {
  idle: 'AI acting weird? Give it a coffee.',
  pouring: 'Pouring… drop it in the chat box.',
  served: 'Served. Send the message.',
  error: 'The cup slipped. Try again.',
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

export default function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [showDisclaimer, setShowDisclaimer] = useState(
    () => localStorage.getItem(SEEN_DISCLAIMER) !== 'yes',
  )
  const pouring = useRef(false)

  // No right-click menu: this is a widget, not a page.
  useEffect(() => {
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  const dismissDisclaimer = useCallback(() => {
    localStorage.setItem(SEEN_DISCLAIMER, 'yes')
    setShowDisclaimer(false)
  }, [])

  const pour = useCallback(async () => {
    if (pouring.current) return
    pouring.current = true
    setStatus('pouring')
    await nextPaint()

    try {
      const outcome = await invoke<PourOutcome>('pour_reality_shot')
      setStatus(outcome === 'dropped' ? 'served' : 'idle')
    } catch (err) {
      console.error('Qahwa: the drag failed to start —', err)
      setStatus('error')
    } finally {
      pouring.current = false
    }
  }, [])

  /**
   * Arms the drag, but waits for actual movement before starting it. Without
   * the threshold a plain click on the cup would open and immediately close a
   * native drag, which Windows reports as a successful drop — so the app would
   * claim it served a coffee that went nowhere.
   */
  const grabCup = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || pouring.current) return
      // Stop the web view starting its own (useless) HTML5 drag.
      e.preventDefault()

      const el = e.currentTarget
      const id = e.pointerId
      const origin = { x: e.clientX, y: e.clientY }

      // Capture so a fast flick out of this small window still reaches us.
      try {
        el.setPointerCapture(id)
      } catch {
        /* capture is a nicety; the listeners below work either way */
      }

      const disarm = () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerup', disarm)
        el.removeEventListener('pointercancel', disarm)
        // Release before the native drag begins: DoDragDrop takes the mouse
        // capture itself and should not have to fight the web view for it.
        if (el.hasPointerCapture(id)) el.releasePointerCapture(id)
      }

      const onMove = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - origin.x, ev.clientY - origin.y) < DRAG_THRESHOLD) return
        disarm()
        void pour()
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', disarm)
      el.addEventListener('pointercancel', disarm)
    },
    [pour],
  )

  // Drop back to the resting state after a moment.
  useEffect(() => {
    if (status !== 'served' && status !== 'error') return
    const t = setTimeout(() => setStatus('idle'), status === 'served' ? 1800 : 2600)
    return () => clearTimeout(t)
  }, [status])

  return (
    <div className="app">
      <header className="bar" data-tauri-drag-region>
        <span className="bar__grip" data-tauri-drag-region />
        <button className="bar__btn" title="About Qahwa" onClick={() => setShowDisclaimer(true)}>
          i
        </button>
        <button className="bar__btn" title="Quit" onClick={() => getCurrentWindow().close()}>
          ✕
        </button>
      </header>

      <div className={`stage stage--${status}`}>
        <CoffeeMachine brewing={status === 'pouring'} />
        <div
          className="cup-slot"
          aria-label="Drag this coffee into a chat box"
          title="Drag me into the chat box"
          draggable={false}
          onPointerDown={grabCup}
          onDragStart={(e) => e.preventDefault()}
        >
          <Cup steaming={status === 'idle'} />
        </div>
      </div>

      <p className="caption">{CAPTION[status]}</p>

      {showDisclaimer && <Disclaimer onClose={dismissDisclaimer} />}
    </div>
  )
}
