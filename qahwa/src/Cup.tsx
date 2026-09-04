/**
 * The cup on the tray. This is only ever the *idle* picture of the cup — the
 * moment a drag starts, the operating system takes over and draws its own copy
 * under the cursor (see `assets/cup-drag.png`), because by then the pointer has
 * left the window and no web content can follow it.
 */
export default function Cup({ steaming }: { steaming: boolean }) {
  return (
    <svg className="cup" viewBox="0 0 64 74" role="img" aria-label="A cup of coffee">
      {steaming && (
        <g className="steam" fill="none" stroke="#C6B29B" strokeWidth="2.4" strokeLinecap="round">
          <path d="M22 14 c4 -4 -4 -8 0 -12" style={{ animationDelay: '0s' }} />
          <path d="M31 11 c4 -4 -4 -9 0 -13" style={{ animationDelay: '0.5s' }} />
          <path d="M40 14 c4 -4 -4 -8 0 -12" style={{ animationDelay: '1s' }} />
        </g>
      )}

      {/* handle, drawn first so the body overlaps it */}
      <path d="M46 36 C59 36 59 54 46 54" fill="none" stroke="#E0D1BE" strokeWidth="6.5" strokeLinecap="round" />

      {/* body */}
      <path d="M12 30 h37 l-4.6 29 a7 7 0 0 1 -6.9 6 h-14 a7 7 0 0 1 -6.9 -6 z" fill="#FDF7EF" />
      <path d="M40 30 h9 l-4.6 29 a7 7 0 0 1 -6.9 6 h-4 a7 7 0 0 0 6.9 -6 z" fill="#E6D8C6" />

      {/* the coffee */}
      <ellipse cx="30.5" cy="30" rx="18.5" ry="5.4" fill="#A06B3C" />
      <ellipse cx="30.5" cy="30.5" rx="15.6" ry="4" fill="#5A331C" />
    </svg>
  )
}
