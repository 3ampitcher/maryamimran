/**
 * The machine itself. Flat, warm, deliberately not photorealistic.
 *
 * The viewBox is 160x170 and the cup is positioned against it in `styles.css`,
 * so the two drawings only line up because the numbers here and there agree.
 * Landmarks worth knowing if you move anything:
 *   y = 88..108  group head and spouts
 *   y = 148      top of the drip tray, which is where the cup stands
 */
export default function CoffeeMachine({ brewing }: { brewing: boolean }) {
  return (
    <svg className="machine" viewBox="0 0 160 170" role="img" aria-label="A small coffee machine">
      <defs>
        <linearGradient id="shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A4230" />
          <stop offset="1" stopColor="#38281D" />
        </linearGradient>
        <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7E6852" />
          <stop offset="0.45" stopColor="#C4AF99" />
          <stop offset="1" stopColor="#6F5A45" />
        </linearGradient>
      </defs>

      {/* body */}
      <rect x="16" y="2" width="128" height="86" rx="15" fill="url(#shell)" />
      <rect x="16" y="2" width="128" height="86" rx="15" fill="none" stroke="#6B5240" strokeWidth="1" />
      {/* warming plate on top */}
      <rect x="34" y="7" width="92" height="7" rx="3.5" fill="#7A5D46" />

      {/* display panel */}
      <rect x="52" y="26" width="56" height="21" rx="7" fill="#1C120C" />
      <rect x="59" y="32" width="24" height="3" rx="1.5" fill="#7C6249" />
      <rect x="59" y="38" width="14" height="3" rx="1.5" fill="#584434" />
      <circle cx="98" cy="37" r="4" className={brewing ? 'lamp lamp--on' : 'lamp'} />

      {/* controls */}
      <circle cx="35" cy="65" r="7" fill="#241810" />
      <circle cx="35" cy="65" r="2.6" fill="#8A6C50" />
      <rect x="54" y="58" width="52" height="14" rx="7" fill="#241810" />
      <rect x="60" y="63" width="16" height="4" rx="2" fill="#6B5340" />
      <circle cx="125" cy="65" r="7" fill="#241810" />
      <circle cx="125" cy="65" r="2.6" fill="#8A6C50" />

      {/* group head, with a portafilter handle out to the left */}
      <rect x="30" y="92" width="34" height="7" rx="3.5" fill="#4B3626" />
      <path d="M60 88 h40 l-6 13 h-28 z" fill="#6A5138" />
      <rect x="66" y="99" width="28" height="4" rx="2" fill="#4B3626" />
      <rect x="72" y="102" width="5" height="7" rx="2.5" fill="url(#steel)" />
      <rect x="83" y="102" width="5" height="7" rx="2.5" fill="url(#steel)" />

      {/* drip tray */}
      <rect x="26" y="148" width="108" height="11" rx="4" fill="#4B3626" />
      <rect x="33" y="150" width="94" height="3.4" rx="1.7" fill="#83694F" />
      <rect x="34" y="159" width="92" height="5" rx="2.5" fill="#3A2A1E" />
    </svg>
  )
}
