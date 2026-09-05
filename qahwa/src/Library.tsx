import { useState } from 'react'
import * as api from './api'
import type { Preset, RecipeView } from './api'
import Cup from './Cups'
import { Confirm, Sheet } from './ui'

export default function Library({
  recipes,
  accents,
  onEdit,
  onChanged,
  onNotice,
  onClose,
}: {
  recipes: RecipeView[]
  accents: Preset[]
  onEdit: (id: string | null) => void
  onChanged: () => void
  onNotice: (message: string) => void
  onClose: () => void
}) {
  const [confirming, setConfirming] = useState<RecipeView | null>(null)

  const run = async (work: Promise<unknown>, message?: string) => {
    try {
      await work
      onChanged()
      if (message) onNotice(message)
    } catch (e) {
      onNotice(String(e))
    }
  }

  /** Moving a recipe rewrites the whole order, which keeps it unambiguous. */
  const move = (from: number, to: number) => {
    if (to < 0 || to >= recipes.length) return
    const ids = recipes.map((r) => r.id)
    const [moved] = ids.splice(from, 1)
    ids.splice(to, 0, moved)
    run(api.reorderRecipes(ids))
  }

  return (
    <Sheet
      title="Recipes"
      onClose={onClose}
      footer={
        <button className="btn btn--primary" onClick={() => onEdit(null)}>
          New recipe
        </button>
      }
    >
      <ul className="recipes">
        {recipes.map((r, i) => (
          <li key={r.id} className={`recipes__row ${r.enabled ? '' : 'recipes__row--off'}`}>
            <span className="recipes__cup">
              <Cup
                icon={r.icon}
                accent={api.accentHex(accents, r.accent)}
                steaming={false}
                className="cup cup--mini"
              />
            </span>

            <span className="recipes__text">
              <span className="recipes__name">
                {r.name} — {r.purpose}
              </span>
              <span className="recipes__file">{r.fileName}</span>
            </span>

            <span className="recipes__tools">
              <button
                className="icon-btn"
                title="Move up"
                aria-label={`Move ${r.name} up`}
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
              >
                ↑
              </button>
              <button
                className="icon-btn"
                title="Move down"
                aria-label={`Move ${r.name} down`}
                disabled={i === recipes.length - 1}
                onClick={() => move(i, i + 1)}
              >
                ↓
              </button>
              <button
                className="icon-btn"
                title={r.enabled ? 'Hide from the menu' : 'Show on the menu'}
                aria-label={r.enabled ? `Hide ${r.name}` : `Show ${r.name}`}
                onClick={() => run(api.setRecipeEnabled(r.id, !r.enabled))}
              >
                {r.enabled ? '👁' : '⃠'}
              </button>
              <button
                className="icon-btn"
                title="Edit"
                aria-label={`Edit ${r.name}`}
                onClick={() => onEdit(r.id)}
              >
                ✎
              </button>
              <button
                className="icon-btn"
                title="Duplicate"
                aria-label={`Duplicate ${r.name}`}
                onClick={() => run(api.duplicateRecipe(r.id), 'Copied.')}
              >
                ⧉
              </button>
              {r.modified && (
                <button
                  className="icon-btn"
                  title="Reset to the original"
                  aria-label={`Reset ${r.name}`}
                  onClick={() => run(api.resetRecipe(r.id), 'Back to the original.')}
                >
                  ⟲
                </button>
              )}
              {!r.builtin && (
                <button
                  className="icon-btn icon-btn--danger"
                  title="Delete"
                  aria-label={`Delete ${r.name}`}
                  onClick={() => setConfirming(r)}
                >
                  🗑
                </button>
              )}
            </span>
          </li>
        ))}
      </ul>

      <p className="fine">
        Built-in coffees can be hidden or edited, and put back the way they were. Only recipes you
        made yourself can be deleted.
      </p>

      {confirming && (
        <Confirm
          question={`Delete ${confirming.name}?`}
          detail="This recipe is yours, so there is no original to restore. Export first if you might want it back."
          confirmLabel="Delete"
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            run(api.deleteRecipe(confirming.id), 'Deleted.')
            setConfirming(null)
          }}
        />
      )}
    </Sheet>
  )
}
