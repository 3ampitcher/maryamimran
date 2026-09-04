/** Shown once on first launch, and any time the ⓘ button is pressed. */
export default function Disclaimer({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet">
      <div className="sheet__body">
        <h1>☕ Qahwa</h1>
        <p>
          Drag the cup into a chat box. It arrives as a file asking the AI to
          re-check its last answer.
        </p>
        <p className="sheet__warn">
          Qahwa asks AI to reconsider and verify its answer. It can still be
          wrong. Verify important information.
        </p>
        <p className="sheet__quiet">
          Qahwa does not read or store your ChatGPT conversations. It makes no
          network calls and keeps no history.
        </p>
      </div>
      <button className="sheet__ok" onClick={onClose}>
        Got it
      </button>
    </div>
  )
}
