/**
 * The coffee visuals.
 *
 * Every cup is drawn in the same 64x74 box with its base on the same line
 * (y = 65), so whichever one is selected sits correctly on the machine's drip
 * tray without the layout having to know which is which.
 *
 * These are only ever the *resting* picture. The moment a drag starts the
 * operating system takes over and draws its own bitmap under the cursor,
 * because by then the pointer has left the window.
 */

export const CERAMIC = '#FDF7EF'
export const SHADE = '#E6D8C6'
export const ESPRESSO = '#4A2C18'
export const COFFEE = '#5A331C'
export const CREMA = '#A06B3C'
export const MILK = '#F1E4D2'
export const FOAM = '#FFFBF4'
export const ICE = '#D3E7F2'

export type SteamKind = 'short' | 'soft' | 'strong' | 'none' | 'cold'

function Steam({ kind }: { kind: SteamKind }) {
  if (kind === 'none') return null

  if (kind === 'cold') {
    // Condensation rather than steam: this glass is cold.
    return (
      <g className="drops" fill="#BBD8E8" opacity="0.75">
        <circle cx="18" cy="44" r="1.5" />
        <circle cx="16" cy="52" r="1.1" />
        <circle cx="46" cy="47" r="1.3" />
        <circle cx="44" cy="56" r="1" />
      </g>
    )
  }

  const style: Record<SteamKind, { width: number; opacity: number; dur: string }> = {
    short: { width: 2.2, opacity: 0.6, dur: '1.9s' },
    soft: { width: 2.6, opacity: 0.45, dur: '3.4s' },
    strong: { width: 3, opacity: 0.7, dur: '2.4s' },
    none: { width: 0, opacity: 0, dur: '0s' },
    cold: { width: 0, opacity: 0, dur: '0s' },
  }
  const s = style[kind]

  return (
    <g
      className="steam"
      fill="none"
      stroke="#C6B29B"
      strokeWidth={s.width}
      strokeLinecap="round"
      opacity={s.opacity}
      style={{ ['--steam-dur' as string]: s.dur }}
    >
      <path d="M22 14 c4 -4 -4 -8 0 -12" style={{ animationDelay: '0s' }} />
      <path d="M31 11 c4 -4 -4 -9 0 -13" style={{ animationDelay: '0.45s' }} />
      <path d="M40 14 c4 -4 -4 -8 0 -12" style={{ animationDelay: '0.9s' }} />
    </g>
  )
}

/** A handle drawn behind the body, so the two read as one piece of ceramic. */
function Handle({ d, color = SHADE, width = 6.5 }: { d: string; color?: string; width?: number }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
}

function Saucer({ y = 68, rx = 26 }: { y?: number; rx?: number }) {
  return (
    <>
      <ellipse cx="32" cy={y} rx={rx} ry={rx * 0.19} fill="#D2BDA4" />
      <ellipse cx="32" cy={y - 1.2} rx={rx * 0.92} ry={rx * 0.15} fill="#E8D9C6" />
    </>
  )
}

/**
 * `base` is the y in cup space that should touch the drip tray. A saucer
 * reaches lower than a bare mug, so aligning every cup on its body would leave
 * the saucered ones hanging through the tray.
 */
type Art = { steam: SteamKind; base: number; body: JSX.Element }

/**
 * Each coffee is a shape, not a recolour: a demitasse is not a mug is not a
 * glass. The accent tints one element per cup so a custom recipe still looks
 * like its own drink.
 */
function art(icon: string, accent: string): Art {
  switch (icon) {
    case 'cappuccino':
      // Wide, generous, foam and a heart.
      return {
        steam: 'soft',
        base: 74.1,
        body: (
          <>
            <Saucer y={69} rx={27} />
            <Handle d="M48 38 C61 38 61 54 48 54" />
            <path d="M9 28 h44 l-5 26 a8 8 0 0 1 -7.9 7 h-18.2 a8 8 0 0 1 -7.9 -7 z" fill={CERAMIC} />
            <path d="M44 28 h9 l-5 26 a8 8 0 0 1 -7.9 7 h-5 a8 8 0 0 0 7.9 -7 z" fill={SHADE} />
            <ellipse cx="31" cy="28" rx="22" ry="6.4" fill={FOAM} />
            <path
              d="M31 24.5 c3.5 -4 9 -0.6 6 3 c-1.8 2.2 -4.4 3.9 -6 4.8 c-1.6 -0.9 -4.2 -2.6 -6 -4.8 c-3 -3.6 2.5 -7 6 -3 z"
              fill={accent}
              opacity="0.85"
            />
          </>
        ),
      }

    case 'americano':
      // Taller, plainer, black. A working mug.
      return {
        steam: 'strong',
        base: 64,
        body: (
          <>
            <Handle d="M47 32 C60 32 60 52 47 52" width={7} />
            <path d="M13 18 h38 l-3.4 40 a7 7 0 0 1 -7 6 h-17.2 a7 7 0 0 1 -7 -6 z" fill={CERAMIC} />
            <path d="M43 18 h8 l-3.4 40 a7 7 0 0 1 -7 6 h-5 a7 7 0 0 0 7 -6 z" fill={SHADE} />
            <ellipse cx="32" cy="18" rx="19" ry="5.6" fill={accent} opacity="0.5" />
            <ellipse cx="32" cy="18.4" rx="16.6" ry="4.3" fill="#3B2312" />
          </>
        ),
      }

    case 'cold-brew':
      // Glass, ice, a straw. The only cup with no heat.
      return {
        steam: 'cold',
        base: 65,
        body: (
          <>
            <rect x="40" y="6" width="4" height="26" rx="2" fill={accent} opacity="0.9" transform="rotate(12 42 19)" />
            <path d="M15 20 h34 l-3 40 a6 6 0 0 1 -6 5 h-16 a6 6 0 0 1 -6 -5 z" fill="#2B1D14" />
            <path d="M17 26 h30 l-2.6 34 a6 6 0 0 1 -6 5 h-12.8 a6 6 0 0 1 -6 -5 z" fill={COFFEE} />
            <g fill={ICE} opacity="0.85">
              <rect x="21" y="28" width="11" height="10" rx="2.5" transform="rotate(-14 26 33)" />
              <rect x="33" y="36" width="10" height="9" rx="2.5" transform="rotate(10 38 40)" />
              <rect x="23" y="45" width="9" height="8" rx="2" transform="rotate(6 27 49)" />
            </g>
            <path
              d="M15 20 h34 l-3 40 a6 6 0 0 1 -6 5 h-16 a6 6 0 0 1 -6 -5 z"
              fill="none"
              stroke="#EAF4FA"
              strokeWidth="2"
              opacity="0.75"
            />
            <ellipse cx="32" cy="20" rx="17" ry="4.6" fill="#EAF4FA" opacity="0.35" />
          </>
        ),
      }

    case 'cortado':
      // Small clear glass, two equal layers. Balance is the whole point.
      return {
        steam: 'short',
        base: 65,
        body: (
          <>
            <path d="M19 30 h26 l-2.4 30 a6 6 0 0 1 -6 5 h-9.2 a6 6 0 0 1 -6 -5 z" fill={MILK} />
            <path d="M19 30 h26 l-1.2 15 h-23.6 z" fill={COFFEE} />
            <path
              d="M19 30 h26 l-2.4 30 a6 6 0 0 1 -6 5 h-9.2 a6 6 0 0 1 -6 -5 z"
              fill="none"
              stroke="#F6EFE6"
              strokeWidth="2"
              opacity="0.8"
            />
            <ellipse cx="32" cy="30" rx="13" ry="3.6" fill={accent} opacity="0.7" />
          </>
        ),
      }

    case 'flat-white':
      // Calm ceramic, thin milk, a rosetta.
      return {
        steam: 'soft',
        base: 73.8,
        body: (
          <>
            <Saucer y={69} rx={25} />
            <Handle d="M47 36 C59 36 59 52 47 52" />
            <path d="M12 26 h40 l-4.4 28 a7.5 7.5 0 0 1 -7.4 6.5 h-16.4 a7.5 7.5 0 0 1 -7.4 -6.5 z" fill={CERAMIC} />
            <path d="M43 26 h9 l-4.4 28 a7.5 7.5 0 0 1 -7.4 6.5 h-5 a7.5 7.5 0 0 0 7.4 -6.5 z" fill={SHADE} />
            <ellipse cx="32" cy="26" rx="20" ry="5.8" fill={CREMA} />
            <ellipse cx="32" cy="26" rx="17" ry="4.6" fill={accent} opacity="0.55" />
            <g stroke={FOAM} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.95">
              <path d="M32 21.5 v9" />
              <path d="M26 23.5 c3 1 3 2.6 0 4" />
              <path d="M38 23.5 c-3 1 -3 2.6 0 4" />
              <path d="M28.5 27.5 c2 0.8 2 1.6 0 2.4" />
              <path d="M35.5 27.5 c-2 0.8 -2 1.6 0 2.4" />
            </g>
          </>
        ),
      }

    case 'latte':
      // Tall glass, visible layers.
      return {
        steam: 'soft',
        base: 65,
        body: (
          <>
            <path d="M20 14 h24 l-2 46 a6 6 0 0 1 -6 5 h-8 a6 6 0 0 1 -6 -5 z" fill={MILK} />
            <path d="M20.6 26 h22.8 l-0.7 16 h-21.4 z" fill={CREMA} opacity="0.85" />
            <path d="M21.3 42 h21.4 l-0.7 18 a6 6 0 0 1 -6 5 h-8 a6 6 0 0 1 -6 -5 z" fill={COFFEE} opacity="0.55" />
            <ellipse cx="32" cy="14" rx="12" ry="3.4" fill={FOAM} />
            <ellipse cx="32" cy="14" rx="9" ry="2.4" fill={accent} opacity="0.5" />
            <path
              d="M20 14 h24 l-2 46 a6 6 0 0 1 -6 5 h-8 a6 6 0 0 1 -6 -5 z"
              fill="none"
              stroke="#F6EFE6"
              strokeWidth="1.8"
              opacity="0.7"
            />
          </>
        ),
      }

    case 'mocha':
      // Chocolate, cream on top, a mug you hold with both hands.
      return {
        steam: 'soft',
        base: 64,
        body: (
          <>
            <Handle d="M48 34 C61 34 61 52 48 52" width={7} />
            <path d="M12 22 h40 l-3.6 36 a7 7 0 0 1 -7 6 h-18.8 a7 7 0 0 1 -7 -6 z" fill="#6B4A34" />
            <path d="M44 22 h8 l-3.6 36 a7 7 0 0 1 -7 6 h-5 a7 7 0 0 0 7 -6 z" fill="#543826" />
            <ellipse cx="32" cy="22" rx="20" ry="5.8" fill="#3A2318" />
            <ellipse cx="32" cy="21" rx="15" ry="4.4" fill={FOAM} />
            <ellipse cx="32" cy="20.6" rx="8" ry="2.4" fill={accent} opacity="0.6" />
            <g fill="#4A2C18" opacity="0.7">
              <circle cx="27" cy="20" r="1" />
              <circle cx="34" cy="21.5" r="0.9" />
              <circle cx="31" cy="19" r="0.8" />
            </g>
          </>
        ),
      }

    case 'turkish':
      // A fincan: small, waisted, patterned, no handle worth speaking of.
      return {
        steam: 'short',
        base: 73.4,
        body: (
          <>
            <Saucer y={69} rx={23} />
            <Handle d="M45 40 C55 40 55 51 45 51" width={5} />
            <path d="M18 30 h28 c0 12 -2 20 -3 25 a7 7 0 0 1 -7 6 h-8 a7 7 0 0 1 -7 -6 c-1 -5 -3 -13 -3 -25 z" fill={CERAMIC} />
            <path d="M40 30 h6 c0 12 -2 20 -3 25 a7 7 0 0 1 -7 6 h-4 a7 7 0 0 0 7 -6 c1 -5 1 -13 1 -25 z" fill={SHADE} />
            <g fill={accent} opacity="0.8">
              <circle cx="32" cy="44" r="3" />
              <circle cx="24" cy="42" r="1.6" />
              <circle cx="40" cy="42" r="1.6" />
              <circle cx="28" cy="51" r="1.3" />
              <circle cx="36" cy="51" r="1.3" />
            </g>
            <ellipse cx="32" cy="30" rx="14" ry="4.2" fill="#3A2011" />
            <ellipse cx="32" cy="29.6" rx="11" ry="3" fill={CREMA} opacity="0.55" />
          </>
        ),
      }

    case 'travel':
      // Lid, sleeve, sip hole. Coffee with somewhere to be.
      return {
        steam: 'none',
        base: 64,
        body: (
          <>
            <path d="M20 34 h24 l-2.2 25 a6 6 0 0 1 -6 5 h-7.6 a6 6 0 0 1 -6 -5 z" fill={CERAMIC} />
            <rect x="18.4" y="40" width="27.2" height="12" rx="2" fill={accent} opacity="0.85" />
            <rect x="17" y="26" width="30" height="9" rx="3.5" fill="#3E2B1E" />
            <rect x="19.5" y="20" width="25" height="7" rx="3" fill="#4E3728" />
            <rect x="27" y="21.5" width="10" height="3.4" rx="1.7" fill="#241811" />
          </>
        ),
      }

    case 'espresso':
    default:
      // A demitasse: small, dark, on a saucer.
      return {
        steam: 'short',
        base: 73.6,
        body: (
          <>
            <Saucer y={69} rx={24} />
            <Handle d="M45 40 C56 40 56 53 45 53" width={5.5} />
            <path d="M19 30 h27 l-3.4 26 a6.5 6.5 0 0 1 -6.4 5.6 h-8.4 a6.5 6.5 0 0 1 -6.4 -5.6 z" fill={CERAMIC} />
            <path d="M39 30 h7 l-3.4 26 a6.5 6.5 0 0 1 -6.4 5.6 h-4 a6.5 6.5 0 0 0 6.4 -5.6 z" fill={SHADE} />
            <ellipse cx="32.5" cy="30" rx="13.5" ry="4" fill={CREMA} />
            <ellipse cx="32.5" cy="30.4" rx="11" ry="3" fill={ESPRESSO} />
            <ellipse cx="32.5" cy="30" rx="6" ry="1.6" fill={accent} opacity="0.35" />
          </>
        ),
      }
  }
}

/**
 * The cup art alone, in its own 64x74 space. Rendered directly into the
 * machine's coordinate system on the main screen so the two scale as one
 * drawing, and inside a standalone `<svg>` everywhere else.
 */
/** Where this cup's lowest point is, so the caller can stand it on the tray. */
export function baselineOf(icon: string): number {
  return art(icon, '#000').base
}

export function CupArt({
  icon,
  accent,
  steaming = true,
}: {
  icon: string
  accent: string
  steaming?: boolean
}) {
  const { steam, body } = art(icon, accent)
  return (
    <>
      {steaming && <Steam kind={steam} />}
      {body}
    </>
  )
}

export default function Cup({
  icon,
  accent,
  steaming = true,
  className = 'cup',
}: {
  icon: string
  accent: string
  steaming?: boolean
  className?: string
}) {
  return (
    <svg className={className} viewBox="0 0 64 74" role="img" aria-hidden="true" focusable="false">
      <CupArt icon={icon} accent={accent} steaming={steaming} />
    </svg>
  )
}
