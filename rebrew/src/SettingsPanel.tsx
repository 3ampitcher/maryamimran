import { useEffect, useState } from 'react'
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

  return (
    <Sheet title="Settings" onClose={onClose}>
      <Toggle
        label="Keep above other apps"
        hint="Rebrew floats over everything else. Off by default."
        checked={settings.alwaysOnTop}
        onChange={(v) => apply({ alwaysOnTop: v }, () => api.setAlwaysOnTop(v))}
      />
      <Toggle
        label="Show Rebrew in the system tray"
        hint="The tray icon is how you get the window back once something covers it."
        checked={settings.showTray}
        onChange={(v) => apply({ showTray: v }, () => api.setShowTray(v))}
      />
      <Toggle
        label="Launch at sign-in"
        hint="Start Rebrew when you sign in."
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
      <p className="fine">Edit any coffee's prompt, or put it back the way Rebrew shipped it.</p>

      <hr className="rule" />

      <p className="fine">
        Rebrew 0.3.0. Everything it remembers lives in one file on this device — no account, no
        server, no network.
      </p>
      {where && <p className="fine fine--path">{where}</p>}
    </Sheet>
  )
}
