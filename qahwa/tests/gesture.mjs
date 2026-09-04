// Behaviour tests for the one gesture the whole app exists for.
//
//   npm run build && npm run test:ui
//
// The Tauri IPC is stubbed, so this checks the *decisions* the UI makes — when
// to start a drag, what to claim afterwards — not the native drag itself. That
// part only exists on Windows and has to be tried by hand.
import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = new URL('../dist', import.meta.url).pathname
if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error('No dist/ to test. Run `npm run build` first.')
  process.exit(1)
}
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.map': 'application/json' }
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]))
  if (!fs.existsSync(p)) { res.writeHead(404).end(); return }
  res.writeHead(200, { 'content-type': types[path.extname(p)] ?? 'application/octet-stream' })
  fs.createReadStream(p).pipe(res)
})
await new Promise((r) => server.listen(4601, r))

// QAHWA_CHROMIUM lets a sandbox point at a browser Playwright did not install.
const browser = await chromium.launch(
  process.env.QAHWA_CHROMIUM ? { executablePath: process.env.QAHWA_CHROMIUM } : {},
)

let failures = 0
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failures++
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`}`)
}

async function session(outcome = 'dropped') {
  const page = await browser.newPage({ viewport: { width: 228, height: 288 } })
  await page.addInitScript((res) => {
    window.__pours = []
    window.__TAURI_INTERNALS__ = {
      invoke: async (cmd) => { window.__pours.push(cmd); return res },
      transformCallback: (f) => f,
      metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } },
    }
  }, outcome)
  await page.goto('http://localhost:4601/')
  await page.click('.sheet__ok')
  return page
}

const box = async (page) => {
  const b = await page.locator('.cup-slot').boundingBox()
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}

console.log('gesture behaviour:')

// 1. A plain click must NOT start a drag.
{
  const page = await session()
  const c = await box(page)
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 1, c.y + 1) // inside the 4px threshold
  await page.mouse.up()
  await page.waitForTimeout(250)
  check('a click leaves the cup alone', await page.evaluate(() => window.__pours.length), 0)
  check('caption stays at rest', await page.textContent('.caption'), 'AI acting weird? Give it a coffee.')
  await page.close()
}

// 2. Press and drag past the threshold must start exactly one pour.
{
  const page = await session('dropped')
  const c = await box(page)
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 30, c.y - 20, { steps: 6 })
  await page.waitForTimeout(250)
  check('dragging pours a shot', await page.evaluate(() => window.__pours), ['pour_reality_shot'])
  check('caption confirms the drop', await page.textContent('.caption'), 'Served. Send the message.')
  await page.mouse.up()
  await page.waitForTimeout(2000)
  check('caption returns to rest', await page.textContent('.caption'), 'AI acting weird? Give it a coffee.')
  await page.close()
}

// 3. A cancelled drag must go straight back to idle, not claim success.
{
  const page = await session('cancelled')
  const c = await box(page)
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 30, c.y - 20, { steps: 6 })
  await page.waitForTimeout(250)
  check('a cancelled drag claims nothing', await page.textContent('.caption'), 'AI acting weird? Give it a coffee.')
  await page.mouse.up()
  await page.close()
}

// 4. One gesture must not fire two pours.
{
  const page = await session()
  const c = await box(page)
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 12 })
  await page.waitForTimeout(300)
  check('one gesture, one file', await page.evaluate(() => window.__pours.length), 1)
  await page.mouse.up()
  await page.close()
}

// 5. A move with no button held must disarm, not pour.
{
  const page = await session()
  const c = await box(page)
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  // A pointermove reporting no buttons: what a missed pointer-up looks like.
  await page.locator('.cup-slot').dispatchEvent('pointermove', {
    pointerId: 1, clientX: c.x + 40, clientY: c.y + 40, buttons: 0,
  })
  await page.waitForTimeout(150)
  check('a released pointer disarms the cup', await page.evaluate(() => window.__pours.length), 0)
  // ...and having disarmed, a later move must not pour either.
  await page.locator('.cup-slot').dispatchEvent('pointermove', {
    pointerId: 1, clientX: c.x + 80, clientY: c.y + 80, buttons: 1,
  })
  await page.waitForTimeout(150)
  check('and stays disarmed afterwards', await page.evaluate(() => window.__pours.length), 0)
  await page.mouse.up()
  await page.close()
}

// 6. The disclaimer shows once and is remembered.
{
  const page = await browser.newPage({ viewport: { width: 228, height: 288 } })
  await page.addInitScript(() => {
    window.__TAURI_INTERNALS__ = { invoke: async () => 'dropped', transformCallback: (f) => f, metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } } }
  })
  await page.goto('http://localhost:4601/')
  check('disclaimer shows on first launch', await page.locator('.sheet').isVisible(), true)
  await page.click('.sheet__ok')
  await page.reload()
  await page.waitForTimeout(150)
  check('disclaimer stays dismissed', await page.locator('.sheet').count(), 0)
  await page.click('.bar__btn[title="About Qahwa"]')
  check('the i button brings it back', await page.locator('.sheet').isVisible(), true)
  await page.close()
}

await browser.close()
server.close()
console.log(failures ? `\n${failures} failing` : '\nall passing')
process.exit(failures ? 1 : 0)
