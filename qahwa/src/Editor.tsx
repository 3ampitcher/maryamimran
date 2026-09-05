import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from './api'
import type { Preset, RecipeInput } from './api'
import Cup from './Cups'
import { Confirm, Sheet } from './ui'

const BLANK: RecipeInput = {
  name: '',
  purpose: '',
  explanation: '',
  prompt: '',
  icon: 'espresso',
  accent: 'espresso',
}

/**
 * The same rule `recipes::file_name` uses in Rust, so the preview shows what
 * will actually land in the chat rather than an approximation.
 */
function previewFileName(emoji: string, name: string, purpose: string) {
  const clean = (s: string) => s.replace(/[\\/:*?"<>|]/g, '-').trim()
  const stem = [clean(name), clean(purpose)].filter(Boolean).join(' - ')
  return `${emoji} ${stem || 'Qahwa recipe'}.md`
}

export default function Editor({
  recipeId,
  icons,
  accents,
  onSaved,
  onClose,
  onNotice,
}: {
  recipeId: string | null
  icons: Preset[]
  accents: Preset[]
  onSaved: (id: string) => void
  onClose: () => void
  onNotice: (message: string) => void
}) {
  const [draft, setDraft] = useState<RecipeInput>(BLANK)
  const [original, setOriginal] = useState<RecipeInput>(BLANK)
  const [loading, setLoading] = useState(recipeId !== null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (recipeId === null) {
      setDraft(BLANK)
      setOriginal(BLANK)
      return
    }
    api
      .getRecipe(recipeId)
      .then((r) => {
        const loaded: RecipeInput = {
          id: r.id,
          name: r.name,
          purpose: r.purpose,
          explanation: r.explanation,
          prompt: r.prompt,
          icon: r.icon,
          accent: r.accent,
        }
        setDraft(loaded)
        setOriginal(loaded)
      })
      .catch((e) => onNotice(String(e)))
      .finally(() => setLoading(false))
  }, [recipeId, onNotice])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(original),
    [draft, original],
  )

  const set = <K extends keyof RecipeInput>(key: K, value: RecipeInput[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const attemptClose = useCallback(() => {
    if (dirty) setLeaving(true)
    else onClose()
  }, [dirty, onClose])

  const submit = async () => {
    if (!draft.name.trim()) return onNotice('Give the coffee a name first.')
    if (!draft.prompt.trim()) return onNotice('A recipe needs a prompt.')
    try {
      const saved = await api.saveRecipe(draft)
      onSaved(saved.id)
    } catch (e) {
      onNotice(String(e))
    }
  }

  const emoji = icons.find((i) => i.id === draft.icon)?.value ?? '☕'
  const accentHex = api.accentHex(accents, draft.accent)

  if (loading) {
    return (
      <Sheet title="Recipe" onClose={onClose}>
        <p className="fine">Opening…</p>
      </Sheet>
    )
  }

  return (
    <Sheet
      title={recipeId === null ? 'New recipe' : 'Edit recipe'}
      onClose={attemptClose}
      footer={
        <>
          <button className="btn" onClick={attemptClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={submit} disabled={!draft.name.trim()}>
            Save
          </button>
        </>
      }
    >
      <div className="preview">
        <Cup icon={draft.icon} accent={accentHex} steaming className="cup cup--preview" />
        <div className="preview__text">
          <p className="preview__name">
            {draft.name || 'Coffee'}
            {draft.purpose ? ` — ${draft.purpose}` : ''}
          </p>
          <p className="preview__file">{previewFileName(emoji, draft.name, draft.purpose)}</p>
          <p className="preview__explain">{draft.explanation || 'One line about what it does.'}</p>
        </div>
      </div>

      <label className="field">
        <span className="field__label">Coffee type</span>
        <input
          value={draft.name}
          maxLength={60}
          placeholder="Espresso"
          onChange={(e) => set('name', e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field__label">What it does</span>
        <input
          value={draft.purpose}
          maxLength={60}
          placeholder="Reality Shot"
          onChange={(e) => set('purpose', e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field__label">One-line explanation</span>
        <input
          value={draft.explanation}
          maxLength={240}
          placeholder="Checks the last answer for factual errors."
          onChange={(e) => set('explanation', e.target.value)}
        />
      </label>

      <fieldset className="field">
        <legend className="field__label">Cup</legend>
        <div className="chips">
          {icons.map((i) => (
            <button
              key={i.id}
              type="button"
              className={`chip ${draft.icon === i.id ? 'chip--on' : ''}`}
              title={i.label}
              aria-label={i.label}
              aria-pressed={draft.icon === i.id}
              onClick={() => set('icon', i.id)}
            >
              <Cup icon={i.id} accent={accentHex} steaming={false} className="cup cup--chip" />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">Colour</legend>
        <div className="chips">
          {accents.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`swatch ${draft.accent === a.id ? 'swatch--on' : ''}`}
              style={{ background: a.value }}
              title={a.label}
              aria-label={a.label}
              aria-pressed={draft.accent === a.id}
              onClick={() => set('accent', a.id)}
            />
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span className="field__label">Prompt</span>
        <textarea
          value={draft.prompt}
          rows={10}
          spellCheck={false}
          placeholder="What the AI should do when this coffee arrives."
          onChange={(e) => set('prompt', e.target.value)}
        />
      </label>

      <p className="fine">
        This is the whole file the AI receives. It is stored on this device and never sent anywhere
        by Qahwa.
      </p>

      {leaving && (
        <Confirm
          question="Leave without saving?"
          detail="The changes to this recipe will be lost."
          confirmLabel="Discard"
          onCancel={() => setLeaving(false)}
          onConfirm={onClose}
        />
      )}
    </Sheet>
  )
}
