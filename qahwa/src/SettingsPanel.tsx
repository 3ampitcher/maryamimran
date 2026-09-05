import { useEffect, useState } from 'react'
import { open, save } from '@tauri-apps/plugin-dialog'
import * as api from './api'
import type { Settings } from './api'
import { Sheet, Toggle } from './ui'

export default function SettingsPanel({
  settings,
  onChanged,
  onManageRecipes,
  onNotice,
  onClose,
}: {
  settings: Settings
  onChanged: (next: Settings) => void
  onManageRecipes: () => void
  onNotice: (message: string) => void
  onClose: () => void
}) {
  const [where, setWhere] = useState('')

  useEffect(() => {
    api.configPath().then(setWhere).catch(() => {})
  }, [])

  /** Applies a preference, and puts it back if the app refuses. */
  const apply = async (patch: Partial<Settings>, run: () => Promise<unknown>) => {
    const previous = settings
    onChanged({ ...settings, ...patch })
    try {
      await run()
    } catch (e) {
      onChanged(previous)
      onNotice(String(e))
    }
  }

  const doExport = async () => {
    try {
      const path = await save({
        title: 'Save a Qahwa backup',
        defaultPath: 'qahwa-recipes.json',
        filters: [{ name: 'Qahwa backup', extensions: ['json'] }],
      })
      if (!path) return
      await api.exportRecipes(path)
      onNotice('Recipes saved.')
    } catch (e) {
      onNotice(String(e))
    }
  }

  const doImport = async () => {
    try {
      const picked = await open({
        title: 'Open a Qahwa backup',
        multiple: false,
        filters: [{ name: 'Qahwa backup', extensions: ['json'] }],
      })
      if (typeof picked !== 'string') return
      const count = await api.importRecipes(picked)
      onNotice(`Restored ${count} ${count === 1 ? 'recipe' : 'recipes'}.`)
    } catch (e) {
      onNotice(String(e))
    }
  }

  return (
    <Sheet title="Settings" onClose={onClose}>
      <Toggle
        label="Keep above other apps"
        hint="Qahwa floats over everything else. Off by default."
        checked={settings.alwaysOnTop}
        onChange={(v) => apply({ alwaysOnTop: v }, () => api.setAlwaysOnTop(v))}
      />
      <Toggle
        label="Show Qahwa in the system tray"
        hint="The tray icon is how you get the window back once something covers it."
        checked={settings.showTray}
        onChange={(v) => apply({ showTray: v }, () => api.setShowTray(v))}
      />
      <Toggle
        label="Launch with Windows"
        hint="Start Qahwa when you sign in."
        checked={settings.launchAtLogin}
        onChange={(v) => apply({ launchAtLogin: v }, () => api.setLaunchAtLogin(v))}
      />

      <div className="row">
        <button className="btn" onClick={() => api.resetWindowSize().catch((e) => onNotice(String(e)))}>
          Restore default size
        </button>
        <button
          className="btn"
          onClick={() => api.resetWindowPosition().catch((e) => onNotice(String(e)))}
        >
          Restore default position
        </button>
      </div>

      <hr className="rule" />

      <button className="btn btn--wide" onClick={onManageRecipes}>
        Manage recipes
      </button>
      <div className="row">
        <button className="btn" onClick={doExport}>
          Export recipes
        </button>
        <button className="btn" onClick={doImport}>
          Import recipes
        </button>
      </div>

      <hr className="rule" />

      <p className="fine">
        Qahwa 0.2.0. Everything it remembers lives in one file on this device — no account, no
        server, no network.
      </p>
      {where && <p className="fine fine--path">{where}</p>}
    </Sheet>
  )
}
