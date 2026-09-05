import { useCallback, useEffect, useState } from 'react'
import { listen } from '@tauri-apps/api/event'
import * as api from './api'
import type { Preset, RecipeView, Settings } from './api'
import Carousel from './Carousel'
import Info from './Info'
import SettingsPanel from './SettingsPanel'
import Library from './Library'
import Editor from './Editor'

export type Screen = 'main' | 'info' | 'settings' | 'library' | 'editor'

export default function App() {
  const [screen, setScreen] = useState<Screen>('main')
  /** Recipe being edited: an id, or '' for a brand new one. */
  const [editing, setEditing] = useState<string | null>(null)
  const [menu, setMenu] = useState<RecipeView[]>([])
  const [all, setAll] = useState<RecipeView[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [icons, setIcons] = useState<Preset[]>([])
  const [accents, setAccents] = useState<Preset[]>([])
  const [index, setIndex] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)

  /** Reloads everything after any change. The lists are tiny; correctness beats
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
        if (!s.seenIntro) setScreen('info')
      })
      .catch((e) => setNotice(String(e)))
  }, [refresh])

  // The tray can flip "keep above other apps" while the window is open.
  useEffect(() => {
    const stop = listen<boolean>('qahwa://always-on-top', (e) =>
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

  const dismissIntro = useCallback(() => {
    api.markIntroSeen().catch(() => {})
    setSettings((s) => (s ? { ...s, seenIntro: true } : s))
    setScreen('main')
  }, [])

  const openEditor = useCallback((id: string | null) => {
    setEditing(id)
    setScreen('editor')
  }, [])

  return (
    <div className="app">
      <header className="bar" data-tauri-drag-region>
        <span className="bar__grip" data-tauri-drag-region />
        {settings?.alwaysOnTop && (
          <span className="bar__pin" title="Staying above other apps" aria-label="Staying above other apps">
            ●
          </span>
        )}
        <button className="bar__btn" title="About Qahwa" onClick={() => setScreen('info')}>
          i
        </button>
        <button className="bar__btn" title="Settings and recipes" onClick={() => setScreen('settings')}>
          ⚙
        </button>
        <button className="bar__btn" title="Close" onClick={() => api.closeWindow()}>
          ✕
        </button>
      </header>

      <Carousel
        recipes={menu}
        index={index}
        accents={accents}
        active={screen === 'main'}
        onChoose={choose}
        onInfo={() => setScreen('info')}
        onNotice={setNotice}
      />

      {notice && <div className="notice">{notice}</div>}

      {screen === 'info' && (
        <Info
          recipe={selected}
          firstRun={settings ? !settings.seenIntro : false}
          onEditRecipe={() => selected && openEditor(selected.id)}
          onClose={settings && !settings.seenIntro ? dismissIntro : () => setScreen('main')}
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
          onEdit={openEditor}
          onChanged={() => refresh(selected?.id)}
          onNotice={setNotice}
          onClose={() => setScreen('settings')}
        />
      )}

      {screen === 'editor' && (
        <Editor
          recipeId={editing}
          icons={icons}
          accents={accents}
          onSaved={(id) => {
            refresh(id)
            setScreen('library')
          }}
          onClose={() => setScreen(editing === null ? 'library' : 'library')}
          onNotice={setNotice}
        />
      )}
    </div>
  )
}
