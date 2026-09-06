import { useCallback, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import * as api from './api'
import type { Preset, RecipeView, Settings, View } from './api'
import AllCoffees from './AllCoffees'
import Carousel from './Carousel'
import DragArt from './DragArt'
import Help from './Help'
import SettingsPanel from './SettingsPanel'
import Library from './Library'
import Editor from './Editor'

export type Screen = 'main' | 'help' | 'settings' | 'library' | 'editor'

/** Four cups on a tray: "show me all the coffees". Deliberately not three
 *  stacked lines — a hamburger promises navigation, and there is none. */
function GridMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7.6" height="7.6" rx="2.2" fill="currentColor" />
      <rect x="12.9" y="3.5" width="7.6" height="7.6" rx="2.2" fill="currentColor" />
      <rect x="3.5" y="12.9" width="7.6" height="7.6" rx="2.2" fill="currentColor" />
      <rect x="12.9" y="12.9" width="7.6" height="7.6" rx="2.2" fill="currentColor" />
    </svg>
  )
}

/** One cup in the middle, the others waiting either side: back to the
 *  carousel. */
function CarouselMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="4.5" width="8" height="15" rx="2.6" fill="currentColor" />
      <rect x="2.6" y="8" width="3.2" height="8" rx="1.6" fill="currentColor" opacity="0.45" />
      <rect x="18.2" y="8" width="3.2" height="8" rx="1.6" fill="currentColor" opacity="0.45" />
    </svg>
  )
}

/** The Rebrew mark: a coffee bean. */
function Bean() {
  return (
    <svg className="brand__mark" viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="7.5" ry="10" fill="#B98A5E" transform="rotate(-30 12 12)" />
      <path
        d="M12 3.2 c-3.4 4 -3.4 13.6 0 17.6"
        fill="none"
        stroke="#3A2617"
        strokeWidth="1.9"
        strokeLinecap="round"
        transform="rotate(-30 12 12)"
      />
    </svg>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('main')
  const [editing, setEditing] = useState<string | null>(null)
  const [menu, setMenu] = useState<RecipeView[]>([])
  const [all, setAll] = useState<RecipeView[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [icons, setIcons] = useState<Preset[]>([])
  const [accents, setAccents] = useState<Preset[]>([])
  const [index, setIndex] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)

  /** Reloads everything after any change. Four recipes; correctness beats
   *  cleverness here. */
  const refresh = useCallback(async (keepId?: string) => {
    const [nextMenu, nextAll, nextSettings] = await Promise.all([
      api.listRecipes(true),
      api.listRecipes(false),
      api.getSettings(),
    ])
    setMenu(nextMenu)
    setAll(nextAll)
    setSettings(nextSettings)

    const wanted = keepId ?? nextSettings.selectedRecipe
    const at = nextMenu.findIndex((r) => r.id === wanted)
    setIndex(at >= 0 ? at : 0)
  }, [])

  useEffect(() => {
    Promise.all([api.iconPresets(), api.accentPresets()])
      .then(([i, a]) => {
        setIcons(i)
        setAccents(a)
      })
      .catch(() => setNotice('Could not load the coffee presets.'))

    refresh()
      .then(() => api.getSettings())
      .then((s) => {
        if (!s.seenIntro) setScreen('help')
      })
      .catch((e) => setNotice(String(e)))
  }, [refresh])

  // The tray can flip "keep above other apps" while the window is open.
  useEffect(() => {
    const stop = listen<boolean>('rebrew://always-on-top', (e) =>
      setSettings((s) => (s ? { ...s, alwaysOnTop: e.payload } : s)),
    )
    return () => {
      stop.then((off) => off())
    }
  }, [])

  // A widget, not a page: no right-click menu, no text selection.
  useEffect(() => {
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(t)
  }, [notice])

  const selected = menu[index]

  const choose = useCallback(
    (next: number) => {
      if (menu.length === 0) return
      const wrapped = (next + menu.length) % menu.length
      setIndex(wrapped)
      api.selectRecipe(menu[wrapped].id).catch(() => {})
    },
    [menu],
  )

  const dismissHelp = useCallback(() => {
    api.markIntroSeen().catch(() => {})
    setSettings((s) => (s ? { ...s, seenIntro: true } : s))
    setScreen('main')
  }, [])

  // The carousel until someone asks for the whole menu, and then whichever
  // they left it on. Remembered on this machine, like every other preference.
  const view: View = settings?.view === 'grid' ? 'grid' : 'carousel'
  const showView = useCallback((next: View) => {
    setSettings((s) => (s ? { ...s, view: next } : s))
    api.setView(next).catch(() => {})
  }, [])

  /** From the All Coffees menu: choose a coffee and go back to the carousel. */
  const pick = useCallback(
    (next: number) => {
      choose(next)
      showView('carousel')
    },
    [choose, showView],
  )

  return (
    <div className="app">
      <header className="bar" data-tauri-drag-region>
        <span className="brand" data-tauri-drag-region>
          <Bean />
          <span className="brand__name" data-tauri-drag-region>
            Rebrew
          </span>
        </span>
        <span className="bar__spacer" data-tauri-drag-region />
        {settings?.alwaysOnTop && (
          <span className="bar__pin" title="Staying above other apps" aria-label="Staying above other apps">
            ●
          </span>
        )}
        <button className="bar__btn" title="Help" aria-label="Help" onClick={() => setScreen('help')}>
          ?
        </button>
        <button
          className="bar__btn"
          title={view === 'grid' ? 'Show one coffee at a time' : 'Show all coffees'}
          aria-label={view === 'grid' ? 'Show one coffee at a time' : 'Show all coffees'}
          aria-pressed={view === 'grid'}
          onClick={() => {
            setScreen('main')
            showView(view === 'grid' ? 'carousel' : 'grid')
          }}
        >
          {view === 'grid' ? <CarouselMark /> : <GridMark />}
        </button>
        <button
          className="bar__btn"
          title="Settings"
          aria-label="Settings"
          onClick={() => setScreen('settings')}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
            />
            <path
              d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.84 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.3a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.88 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.63 1.7 1.7 0 0 0 10 3.07V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.1a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>
        <button className="bar__btn" title="Close" aria-label="Close" onClick={() => api.closeWindow()}>
          ✕
        </button>
      </header>

      {view === 'grid' ? (
        <AllCoffees
          recipes={menu}
          index={index}
          accents={accents}
          onPick={pick}
          onNotice={setNotice}
        />
      ) : (
        <Carousel
          recipes={menu}
          index={index}
          accents={accents}
          active={screen === 'main'}
          onChoose={choose}
          onNotice={setNotice}
        />
      )}

      {/* Offscreen: the picture each coffee drags under the cursor. */}
      <DragArt recipes={menu} accents={accents} />

      {notice && <div className="notice">{notice}</div>}

      {screen === 'help' && (
        <Help
          firstRun={settings ? !settings.seenIntro : false}
          onClose={settings && !settings.seenIntro ? dismissHelp : () => setScreen('main')}
        />
      )}

      {screen === 'settings' && settings && (
        <SettingsPanel
          settings={settings}
          onChanged={(s) => setSettings(s)}
          onManageRecipes={() => setScreen('library')}
          onNotice={setNotice}
          onClose={() => setScreen('main')}
        />
      )}

      {screen === 'library' && (
        <Library
          recipes={all}
          accents={accents}
          onEdit={(id) => {
            setEditing(id)
            setScreen('editor')
          }}
          onChanged={() => refresh(selected?.id)}
          onNotice={setNotice}
          onClose={() => setScreen('settings')}
        />
      )}

      {screen === 'editor' && editing && (
        <Editor
          recipeId={editing}
          fileName={all.find((r) => r.id === editing)?.fileName ?? ''}
          icons={icons}
          accents={accents}
          onSaved={(id) => {
            refresh(id)
            setScreen('library')
          }}
          onClose={() => setScreen('library')}
          onNotice={setNotice}
        />
      )}
    </div>
  )
}
