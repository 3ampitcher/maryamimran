// Regenerates the app icons and the drag-preview bitmap.
//   node scripts/gen-assets.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { canvas, paint, ellipse, annulus, and, not, encodePng, encodeIco } from './render.mjs'

const ROOT = new URL('..', import.meta.url).pathname

// Warm ceramic-and-espresso palette. Nothing is pure black on purpose: the
// Windows drag-image helper treats black as its colour key.
const SAUCER = [0xe8, 0xd9, 0xc6]
const SAUCER_EDGE = [0xd2, 0xbd, 0xa4]
const CERAMIC = [0xfd, 0xf7, 0xef]
const CERAMIC_SHADE = [0xe4, 0xd6, 0xc4]
const COFFEE = [0x5a, 0x33, 0x1c]
const CREMA = [0x9c, 0x66, 0x38]
const BG = [0x2f, 0x21, 0x1a]

const CUP_TOP = 0.30
const CUP_BOT = 0.76
const HW_TOP = 0.235
const HW_BOT = 0.175

// Tapered cup body, rounded off at the base.
const halfWidthAt = (y) => {
  const t = (y - CUP_TOP) / (CUP_BOT - CUP_TOP)
  let hw = HW_TOP + (HW_BOT - HW_TOP) * t
  if (t > 0.86) {
    const u = (t - 0.86) / 0.14
    hw *= Math.sqrt(Math.max(0, 1 - u * u))
  }
  return hw
}
const cupBody = (x, y) => y >= CUP_TOP && y <= CUP_BOT && Math.abs(x - 0.5) <= halfWidthAt(y)

// Handle sits on the right, clipped so it reads as attached rather than floating.
const handle = and(annulus(0.735, 0.47, 0.135, 0.078), (x) => x > 0.70)

const drawCup = (c, { saucer = true } = {}) => {
  if (saucer) {
    paint(c, ellipse(0.5, 0.83, 0.40, 0.072), SAUCER_EDGE)
    paint(c, ellipse(0.5, 0.815, 0.375, 0.058), SAUCER)
  }
  // The handle is drawn first and a shade darker, so the body overlaps it and
  // the two read as one piece of ceramic rather than a ring stuck on the side.
  paint(c, handle, CERAMIC_SHADE)
  paint(c, cupBody, CERAMIC)
  // A soft shade down the right flank gives the flat shape some volume.
  paint(c, and(cupBody, (x, y) => x - 0.5 > halfWidthAt(y) * 0.42), CERAMIC_SHADE)
  paint(c, ellipse(0.5, CUP_TOP, HW_TOP, 0.062), CREMA)
  paint(c, ellipse(0.5, CUP_TOP + 0.004, HW_TOP - 0.022, 0.048), COFFEE)
}

const appIcon = (size) => {
  const c = canvas(size, size)
  const radius = 0.22
  const rounded = (x, y) => {
    const cx = Math.min(Math.max(x, radius), 1 - radius)
    const cy = Math.min(Math.max(y, radius), 1 - radius)
    return Math.hypot(x - cx, y - cy) <= radius || (x >= radius && x <= 1 - radius) || (y >= radius && y <= 1 - radius)
  }
  paint(c, rounded, BG)
  drawCup(c)
  return c
}

// The bitmap Windows drags under the cursor. Transparent background, no saucer,
// so it reads as the cup itself lifted out of the machine.
const dragImage = (size) => {
  const c = canvas(size, size)
  drawCup(c, { saucer: false })
  return c
}

mkdirSync(`${ROOT}src-tauri/icons`, { recursive: true })
const write = (rel, buf) => {
  writeFileSync(`${ROOT}${rel}`, buf)
  console.log(`  ${rel}  ${(buf.length / 1024).toFixed(1)} KB`)
}

console.log('icons:')
for (const [name, size] of [['32x32.png', 32], ['128x128.png', 128], ['128x128@2x.png', 256], ['icon.png', 512]]) {
  write(`src-tauri/icons/${name}`, encodePng(appIcon(size)))
}
write('src-tauri/icons/icon.ico', encodeIco([16, 32, 48, 64, 128, 256].map(appIcon)))

console.log('drag preview:')
write('src-tauri/assets/cup-drag.png', encodePng(dragImage(160)))
