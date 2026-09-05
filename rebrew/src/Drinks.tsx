/**
 * The four Rebrew drinks.
 *
 * Every drink is drawn in the same 64x74 box and declares the y where it meets
 * the drip tray, so whichever one is selected stands on the tray correctly
 * without the layout knowing which is which. One palette, one rim weight, one
 * shadow: a demitasse and an iced glass should look like they came from the
 * same café.
 *
 * These are only ever the *resting* picture. The moment a drag starts the
 * operating system takes over and draws its own bitmap under the cursor,
 * because by then the pointer has left the window.
 */

const IVORY = '#F7EFE4'
const IVORY_SHADE = '#E3D5C3'
const SAUCER = '#EFE5D6'
const SAUCER_EDGE = '#D3C2AB'
const ESPRESSO = '#3B2216'
const COFFEE = '#5A3520'
const CREMA = '#A9764B'
const FOAM = '#FFFAF2'
const MILK = '#EFE0CB'
const GLASS_RIM = '#EFE7DC'
const ICE = '#CFE0EA'
const ICE_EDGE = '#B6CEDD'

/** One rim weight everywhere, so the glasses and the cups feel related. */
const RIM = 1.8

type Art = {
  /** Hot drinks steam; cold ones have ice that drifts. */
  kind: 'hot' | 'cold'
  /** The y in this box that should sit on the drip tray. */
  base: number
  body: JSX.Element
}

/** The soft contact shadow every drink shares. */
function Shadow({ cy, rx }: { cy: number; rx: number }) {
  return <ellipse cx="32" cy={cy} rx={rx} ry={rx * 0.13} fill="#1B120C" opacity="0.28" />
}

function Saucer({ cy, rx }: { cy: number; rx: number }) {
  return (
    <>
      <ellipse cx="32" cy={cy} rx={rx} ry={rx * 0.2} fill={SAUCER_EDGE} />
      <ellipse cx="32" cy={cy - 1.3} rx={rx * 0.9} ry={rx * 0.155} fill={SAUCER} />
    </>
  )
}

/** Drawn behind the body so cup and handle read as one piece of ceramic. */
function Handle({ d, width = 5.5 }: { d: string; width?: number }) {
  return (
    <path d={d} fill="none" stroke={IVORY_SHADE} strokeWidth={width} strokeLinecap="round" />
  )
}

/** Steam for the hot drinks: two or three thin curves, rising and fading. */
function Steam({ x }: { x: number[] }) {
  return (
    <g className="steam" fill="none" stroke="#C9B7A2" strokeWidth="2" strokeLinecap="round">
      {x.map((cx, i) => (
        <path
          key={cx}
          d={`M${cx} 20 c3.4 -3.6 -3.4 -7 0 -10.6`}
          style={{ animationDelay: `${i * 0.8}s` }}
        />
      ))}
    </g>
  )
}

/**
 * An ice cube that drifts a pixel or two. Each gets its own duration and delay
 * so a glass never bobs as one lump.
 */
function Ice({
  x,
  y,
  size,
  tilt,
  seed,
}: {
  x: number
  y: number
  size: number
  tilt: number
  seed: number
}) {
  return (
    <g
      className="ice"
      style={{ animationDuration: `${3.2 + seed * 0.7}s`, animationDelay: `${seed * 0.55}s` }}
    >
      <rect
        x={x}
        y={y}
        width={size}
        height={size * 0.88}
        rx={size * 0.26}
        fill={ICE}
        stroke={ICE_EDGE}
        strokeWidth="0.9"
        transform={`rotate(${tilt} ${x + size / 2} ${y + size / 2})`}
        opacity="0.9"
      />
    </g>
  )
}

function art(icon: string, accent: string): Art {
  switch (icon) {
    case 'cappuccino':
      // Wide and generous: foam to the rim, and a heart.
      return {
        kind: 'hot',
        base: 71.6,
        body: (
          <>
            <Shadow cy={70} rx={23} />
            <Saucer cy={67} rx={23} />
            <Handle d="M47 38 C59 38 59 52 47 52" width={6} />
            <path
              d="M15 30 h34 l-3.6 21 a7 7 0 0 1 -6.9 6 h-13 a7 7 0 0 1 -6.9 -6 z"
              fill={IVORY}
            />
            <path d="M42 30 h7 l-3.6 21 a7 7 0 0 1 -6.9 6 h-4 a7 7 0 0 0 6.9 -6 z" fill={IVORY_SHADE} />
            <ellipse cx="32" cy="30" rx="17" ry="4.9" fill={CREMA} />
            <ellipse cx="32" cy="29.7" rx="15" ry="4.1" fill={FOAM} />
            {/* The latte art is always crema, never the accent: this cup's
                accent is cream, and a cream heart on cream foam is no heart. */}
            <path
              d="M32 27 c2.6 -3 6.7 -0.5 4.5 2.2 c-1.4 1.7 -3.3 3 -4.5 3.6 c-1.2 -0.6 -3.1 -1.9 -4.5 -3.6 c-2.2 -2.7 1.9 -5.2 4.5 -2.2 z"
              fill="#B0784A"
            />
            <ellipse cx="32" cy="29.7" rx="15" ry="4.1" fill={accent} opacity="0.18" />
          </>
        ),
      }

    case 'latte':
      // Tall iced glass: milk below, espresso above, ice and a straw.
      return {
        kind: 'cold',
        base: 68.5,
        body: (
          <>
            <Shadow cy={68} rx={16} />
            <Saucer cy={65.5} rx={15} />
            {/* straw */}
            <rect
              x="40.6"
              y="9"
              width="3.2"
              height="20"
              rx="1.6"
              fill={accent}
              transform="rotate(14 42 17)"
            />
            {/* glass, filled milk-first so the coffee layer floats on top */}
            <path d="M21 16 h22 l-2 42 a5 5 0 0 1 -5 4.5 h-8 a5 5 0 0 1 -5 -4.5 z" fill={MILK} />
            <path d="M21.3 22 h21.4 l-1.1 22 h-19.2 z" fill={CREMA} opacity="0.55" />
            <path d="M21.1 18 h21.8 l-0.6 12 h-20.6 z" fill={COFFEE} opacity="0.8" />
            <Ice x={23} y={22} size={9} tilt={-14} seed={0} />
            <Ice x={32} y={30} size={8} tilt={11} seed={1} />
            <Ice x={24} y={40} size={7.5} tilt={5} seed={2} />
            <path
              d="M21 16 h22 l-2 42 a5 5 0 0 1 -5 4.5 h-8 a5 5 0 0 1 -5 -4.5 z"
              fill="none"
              stroke={GLASS_RIM}
              strokeWidth={RIM}
              opacity="0.85"
            />
            <ellipse cx="32" cy="16" rx="11" ry="3" fill={GLASS_RIM} opacity="0.4" />
          </>
        ),
      }

    case 'americano':
      // Shorter, wider, very dark. No milk, no straw.
      return {
        kind: 'cold',
        base: 63,
        body: (
          <>
            <Shadow cy={65} rx={17} />
            <path d="M17 30 h30 l-1.8 28 a5 5 0 0 1 -5 4.5 h-16.4 a5 5 0 0 1 -5 -4.5 z" fill="#2A170E" />
            <path d="M17.5 34 h29 l-1.6 24 a5 5 0 0 1 -5 4.5 h-15.8 a5 5 0 0 1 -5 -4.5 z" fill={ESPRESSO} />
            <Ice x={21} y={34} size={9.5} tilt={-12} seed={0} />
            <Ice x={32} y={40} size={8.5} tilt={14} seed={1} />
            <Ice x={25} y={47} size={8} tilt={4} seed={2} />
            <path
              d="M17 30 h30 l-1.8 28 a5 5 0 0 1 -5 4.5 h-16.4 a5 5 0 0 1 -5 -4.5 z"
              fill="none"
              stroke={GLASS_RIM}
              strokeWidth={RIM}
              opacity="0.85"
            />
            <ellipse cx="32" cy="30" rx="15" ry="3.6" fill={GLASS_RIM} opacity="0.35" />
            <ellipse cx="32" cy="30.4" rx="12.6" ry="2.7" fill={accent} opacity="0.28" />
          </>
        ),
      }

    case 'espresso':
    default:
      // A demitasse: small, dark, on a saucer.
      return {
        kind: 'hot',
        base: 71,
        body: (
          <>
            <Shadow cy={70} rx={19} />
            <Saucer cy={67} rx={19} />
            <Handle d="M44 40 C54 40 54 51 44 51" width={5} />
            <path d="M22 34 h21 l-2.6 19 a6 6 0 0 1 -6 5 h-4.8 a6 6 0 0 1 -6 -5 z" fill={IVORY} />
            <path d="M37 34 h6 l-2.6 19 a6 6 0 0 1 -6 5 h-3 a6 6 0 0 0 6 -5 z" fill={IVORY_SHADE} />
            <ellipse cx="32.5" cy="34" rx="10.5" ry="3.2" fill={CREMA} />
            <ellipse cx="32.5" cy="34.3" rx="8.6" ry="2.5" fill={ESPRESSO} />
            <ellipse cx="32.5" cy="34" rx="4.6" ry="1.2" fill={accent} opacity="0.3" />
          </>
        ),
      }
  }
}

/** Where this drink's lowest point is, so the caller can stand it on the tray. */
export function baselineOf(icon: string): number {
  return art(icon, '#000').base
}

/**
 * The drink alone, in its own 64x74 space. Rendered directly into the machine's
 * coordinate system on the main screen so the two scale as one drawing, and
 * inside a standalone `<svg>` everywhere else.
 */
export function DrinkArt({
  icon,
  accent,
  animated = true,
}: {
  icon: string
  accent: string
  animated?: boolean
}) {
  const { kind, body } = art(icon, accent)
  return (
    <>
      {animated && kind === 'hot' && <Steam x={icon === 'cappuccino' ? [25, 32, 39] : [27, 34]} />}
      {body}
    </>
  )
}

export default function Drink({
  icon,
  accent,
  animated = true,
  className = 'drink',
}: {
  icon: string
  accent: string
  animated?: boolean
  className?: string
}) {
  return (
    <svg className={className} viewBox="0 0 64 74" role="img" aria-hidden="true" focusable="false">
      <DrinkArt icon={icon} accent={accent} animated={animated} />
    </svg>
  )
}
