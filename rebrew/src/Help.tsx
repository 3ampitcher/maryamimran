import { Sheet } from './ui'

const MENU = [
  ['Espresso', 'Reality Shot', 'Checks the last answer for facts, sources and weak assumptions.'],
  ['Cappuccino', 'Human Touch', 'Rewrites so it sounds like a person, without changing what it says.'],
  ['Latte', 'Second Opinion', 'Gets out of the first idea and finds genuinely different directions.'],
  ['Americano', 'The Challenger', 'Argues against your idea the way a judge or investor would.'],
]

export default function Help({ firstRun, onClose }: { firstRun: boolean; onClose: () => void }) {
  return (
    <Sheet
      title="Rebrew"
      onClose={onClose}
      footer={
        <button className="btn btn--primary" onClick={onClose}>
          {firstRun ? 'Got it' : 'Done'}
        </button>
      }
    >
      <p className="lede">A café for better AI answers.</p>

      <p className="para">
        Pick a coffee and drag it into ChatGPT, Claude, or anything else that takes an uploaded
        file. It arrives as a small Markdown file, and the AI follows what is written inside. Send
        the message as usual.
      </p>

      <p className="para">
        Press and hold on the drink, move across to the chat, and let go. A quick click does
        nothing — that is deliberate, so you cannot send one by accident.
      </p>

      <h2 className="section">The menu</h2>
      <ul className="menu">
        {MENU.map(([name, purpose, what]) => (
          <li key={name}>
            <span className="menu__name">{name}</span>
            <span className="menu__purpose">{purpose}</span>
            <span className="menu__what">{what}</span>
          </li>
        ))}
      </ul>

      <h2 className="section">Worth knowing</h2>
      <ul className="facts">
        <li>Rebrew does not read or store your chats. Everything stays on this device.</li>
        <li>AI can still be wrong, including right after a Rebrew prompt.</li>
        <li>Check anything that matters — medical, legal, financial or safety — for yourself.</li>
        <li>
          The checking and research steps only work if the AI you are using can actually browse or
          run tools. Without them it can only re-read its own answer.
        </li>
      </ul>
    </Sheet>
  )
}
