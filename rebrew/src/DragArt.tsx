/**
 * The bitmap that rides under the cursor once the drag has left the window.
 *
 * The operating system draws that picture, not the web view, so it has to be
 * handed over as pixels before the gesture starts. A single baked-in cup would
 * mean dragging an Espresso and watching a stranger's cup follow the pointer —
 * so each coffee is rasterised from the very drawing the window is showing,
 * cropped to what the eye sees and kept at its own scale, and cached.
 *
 * Rasterising is async and the drag is not: the whole menu is prepared while
 * the app is idle, and `dragImageFor` is a synchronous cache lookup by the time
 * anyone reaches for a cup. If it comes back empty the app falls back to the
 * bundled cup, which is what Rebrew always used.
 */
import { useEffect, useRef } from 'react'
import * as api from './api'
import type { Preset, RecipeView } from './api'
import { DrinkArt, placementOf } from './Drinks'

/** Art units to bitmap pixels. Every drink shares it, so a demitasse still
 *  arrives smaller than a tumbler. */
const UNITS_TO_PX = 2.6
/** A little air around the drink, in art units, so nothing touches the edge. */
const PAD = 2

const cache = new Map<string, number[]>()

const artKey = (icon: string, accent: string) => `${icon}|${accent}`

/** The prepared bitmap for a coffee, or null if it is not ready. */
export function dragImageFor(icon: string, accent: string): number[] | null {
  return cache.get(artKey(icon, accent)) ?? null
}

async function rasterise(svg: SVGSVGElement, w: number, h: number): Promise<number[]> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(w))
  clone.setAttribute('height', String(h))
  const markup = new XMLSerializer().serializeToString(clone)

  const img = new Image()
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
  await img.decode()

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no 2d canvas context')
  ctx.drawImage(img, 0, 0, w, h)

  // Windows hands the drag helper a colour key of pure black, so a black pixel
  // would be punched out of the picture. Nothing in the palette is #000000 —
  // but compositing is not the palette, so raise anything that landed there.
  try {
    const frame = ctx.getImageData(0, 0, w, h)
    const d = frame.data
    let touched = false
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 0 && d[i] === 0 && d[i + 1] === 0 && d[i + 2] === 0) {
        d[i] = d[i + 1] = d[i + 2] = 1
        touched = true
      }
    }
    if (touched) ctx.putImageData(frame, 0, 0)
  } catch {
    // A browser that refuses to read the pixels back still encodes them fine.
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('the drink would not encode')
  return Array.from(new Uint8Array(await blob.arrayBuffer()))
}

/** Where each drink's bitmap is cropped to, and how big it comes out. */
function frameOf(icon: string) {
  const { box, scale } = placementOf(icon)
  return {
    viewBox: `${box.x - PAD} ${box.y - PAD} ${box.w + PAD * 2} ${box.h + PAD * 2}`,
    w: Math.round((box.w + PAD * 2) * scale * UNITS_TO_PX),
    h: Math.round((box.h + PAD * 2) * scale * UNITS_TO_PX),
  }
}

/**
 * Renders every coffee on the menu offscreen and turns each into its drag
 * bitmap. Mounted once, for the life of the window.
 */
export default function DragArt({
  recipes,
  accents,
}: {
  recipes: RecipeView[]
  accents: Preset[]
}) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!host.current || accents.length === 0) return
    const div = host.current
    const svgs = Array.from(div.querySelectorAll<SVGSVGElement>('svg[data-art]'))
    let cancelled = false
    let ready = 0
    void (async () => {
      for (const svg of svgs) {
        const key = svg.dataset.art
        if (cancelled) return
        if (!key) continue
        if (!cache.has(key)) {
          try {
            const png = await rasterise(svg, Number(svg.dataset.w), Number(svg.dataset.h))
            if (cancelled) return
            cache.set(key, png)
          } catch (e) {
            // The bundled cup is still there; a drag never fails over this.
            console.warn('Rebrew: could not prepare a drag preview —', e)
            continue
          }
        }
        // How many coffees are carrying their own picture. Only a test reads
        // this, but it is the one thing about this component worth observing.
        div.dataset.ready = String(++ready)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [recipes, accents])

  return (
    <div className="drag-art" ref={host} aria-hidden="true">
      {recipes.map((r) => {
        const { viewBox, w, h } = frameOf(r.icon)
        return (
          <svg
            key={r.id}
            data-art={artKey(r.icon, r.accent)}
            data-w={w}
            data-h={h}
            viewBox={viewBox}
            width={w}
            height={h}
          >
            <DrinkArt icon={r.icon} accent={api.accentHex(accents, r.accent)} animated={false} />
          </svg>
        )
      })}
    </div>
  )
}
