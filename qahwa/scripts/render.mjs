// Minimal procedural renderer + PNG/ICO encoder.
// Everything is drawn from shape predicates in a 0..1 coordinate space, so the
// same cup renders crisply at 16px and at 512px. No image dependencies.
import { deflateSync } from 'node:zlib'

const SS = 4 // supersampling factor per axis

export function canvas(w, h) {
  return { w, h, data: new Uint8ClampedArray(w * h * 4) }
}

// Composite `color` over the canvas wherever `inside(x, y)` is true, using
// SSxSS coverage sampling for antialiasing.
export function paint(c, inside, color) {
  const [r, g, b, a = 255] = color
  for (let py = 0; py < c.h; py++) {
    for (let px = 0; px < c.w; px++) {
      let hits = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) / c.w
          const y = (py + (sy + 0.5) / SS) / c.h
          if (inside(x, y)) hits++
        }
      }
      if (!hits) continue
      const alpha = (a / 255) * (hits / (SS * SS))
      const i = (py * c.w + px) * 4
      const dstA = c.data[i + 3] / 255
      const outA = alpha + dstA * (1 - alpha)
      if (outA <= 0) continue
      for (let k = 0; k < 3; k++) {
        const src = [r, g, b][k]
        c.data[i + k] = (src * alpha + c.data[i + k] * dstA * (1 - alpha)) / outA
      }
      c.data[i + 3] = outA * 255
    }
  }
}

/* ---------- shape helpers (normalised 0..1 space) ---------- */

export const ellipse = (cx, cy, rx, ry) => (x, y) => {
  const dx = (x - cx) / rx
  const dy = (y - cy) / ry
  return dx * dx + dy * dy <= 1
}

export const annulus = (cx, cy, rOuter, rInner, aspect = 1) => (x, y) => {
  const dx = (x - cx) / aspect
  const dy = y - cy
  const d = Math.hypot(dx, dy)
  return d <= rOuter && d >= rInner
}

export const roundedRect = (x0, y0, x1, y1, r) => (x, y) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  const cx = Math.min(Math.max(x, x0 + r), x1 - r)
  const cy = Math.min(Math.max(y, y0 + r), y1 - r)
  return Math.hypot(x - cx, y - cy) <= r || (x >= x0 + r && x <= x1 - r) || (y >= y0 + r && y <= y1 - r)
}

export const and = (...fns) => (x, y) => fns.every((f) => f(x, y))
export const not = (fn) => (x, y) => !fn(x, y)

/* ---------- PNG ---------- */

const crcTable = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

const crc32 = (buf) => {
  let c = -1
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

const chunk = (type, body) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(body.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), body])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([len, typed, crc])
}

export function encodePng(c) {
  const raw = Buffer.alloc(c.h * (c.w * 4 + 1))
  for (let y = 0; y < c.h; y++) {
    raw[y * (c.w * 4 + 1)] = 0 // filter: none
    Buffer.from(c.data.buffer, y * c.w * 4, c.w * 4).copy(raw, y * (c.w * 4 + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(c.w, 0)
  ihdr.writeUInt32BE(c.h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ---------- ICO ---------- */

// 32-bit BGRA DIB entries with an AND mask. Plain DIB (rather than PNG-in-ICO)
// because that is what every Windows shell path reads without complaint.
function dibEntry(c) {
  const header = Buffer.alloc(40)
  header.writeUInt32LE(40, 0)
  header.writeInt32LE(c.w, 4)
  header.writeInt32LE(c.h * 2, 8) // colour rows + mask rows
  header.writeUInt16LE(1, 12)
  header.writeUInt16LE(32, 14)
  const xor = Buffer.alloc(c.w * c.h * 4)
  for (let y = 0; y < c.h; y++) {
    for (let x = 0; x < c.w; x++) {
      const src = ((c.h - 1 - y) * c.w + x) * 4 // DIBs are bottom-up
      const dst = (y * c.w + x) * 4
      xor[dst] = c.data[src + 2]
      xor[dst + 1] = c.data[src + 1]
      xor[dst + 2] = c.data[src]
      xor[dst + 3] = c.data[src + 3]
    }
  }
  const maskRow = Math.ceil(c.w / 32) * 4
  const and = Buffer.alloc(maskRow * c.h) // fully opaque mask; alpha does the work
  return Buffer.concat([header, xor, and])
}

export function encodeIco(canvases) {
  const images = canvases.map(dibEntry)
  const dir = Buffer.alloc(6)
  dir.writeUInt16LE(0, 0)
  dir.writeUInt16LE(1, 2) // type: icon
  dir.writeUInt16LE(canvases.length, 4)
  const entries = []
  let offset = 6 + canvases.length * 16
  canvases.forEach((c, i) => {
    const e = Buffer.alloc(16)
    e[0] = c.w >= 256 ? 0 : c.w
    e[1] = c.h >= 256 ? 0 : c.h
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(images[i].length, 8)
    e.writeUInt32LE(offset, 12)
    entries.push(e)
    offset += images[i].length
  })
  return Buffer.concat([dir, ...entries, ...images])
}
