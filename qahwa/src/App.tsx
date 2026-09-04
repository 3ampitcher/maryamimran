import { useCallback, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import CoffeeMachine from './CoffeeMachine'
import Cup from './Cup'
import Disclaimer from './Disclaimer'

type PourOutcome = 'dropped' | 'cancelled'
type Status = 'idle' | 'pouring' | 'served' | 'error'

const SEEN_DISCLAIMER = 'qahwa.disclaimer.v1'

const CAPTION: Record<Status, string> = {
  idle: 'AI acting weird? Give it a coffee.',
  pouring: 'Pouring… drop it in the chat box.',
  served: 'Served. Send the message.',
  error: 'The cup slipped. Try again.',
}

export default function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [showDisclaimer, setShowDisclaimer] = useState(
    () => localStorage.getItem(SEEN_DISCLAIMER) !== 'yes',
  )

  // No right-click menu, and no text selection anywhere — this is a widget,
  // not a page.
  useEffect(() => {
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  const dismissDisclaimer = useCallback(() => {
    localStorage.setItem(SEEN_DISCLAIMER, 'yes')
    setShowDisclaimer(false)
  }, [])

  const grabCup = useCallback(
    async (e: React.PointerEvent) => {
      if (e.button !== 0 || status === 'pouring') return
      // Stop the web view from starting its own (useless) HTML5 drag.
      e.preventDefault()

      setStatus('pouring')
      // On Windows the native drag blocks the main thread for its whole
      // duration, so the web view cannot repaint once it starts. Let the
      // "pouring" frame land before handing the thread over.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      try {
        const outcome = await invoke<PourOutcome>('pour_reality_shot')
        setStatus(outcome === 'dropped' ? 'served' : 'idle')
      } catch (err) {
        console.error('pour failed', err)
        setStatus('error')
      }
    },
    [status],
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
          role="button"
          tabIndex={0}
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
