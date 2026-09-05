import type { RecipeView } from './api'
import { Sheet } from './ui'

export default function Info({
  recipe,
  firstRun,
  onEditRecipe,
  onClose,
}: {
  recipe: RecipeView | undefined
  firstRun: boolean
  onEditRecipe: () => void
  onClose: () => void
}) {
  return (
    <Sheet
      title="☕ Qahwa"
      onClose={onClose}
      footer={
        <button className="btn btn--primary" onClick={onClose}>
          {firstRun ? 'Got it' : 'Done'}
        </button>
      }
    >
      <p className="lede">
        Qahwa puts useful AI prompts within reach. Choose a coffee, drag the cup into your chat, and
        send the attached recipe.
      </p>

      {recipe && (
        <div className="card">
          <p className="card__title">
            {recipe.name} — {recipe.purpose}
          </p>
          <p className="card__text">{recipe.explanation}</p>
          <button className="btn btn--small" onClick={onEditRecipe}>
            Edit recipe
          </button>
        </div>
      )}

      <ul className="facts">
        <li>Qahwa does not read or store your chats.</li>
        <li>Recipes and preferences stay on this device.</li>
        <li>AI responses can still be wrong.</li>
        <li>Verify important medical, legal, financial and safety-related information.</li>
        <li>
          Research features only work when the receiving chatbot has access to browsing or other
          tools.
        </li>
      </ul>
    </Sheet>
  )
}
