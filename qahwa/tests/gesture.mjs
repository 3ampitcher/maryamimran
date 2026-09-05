// Behaviour tests for the one gesture the whole app exists for, plus the
// carousel around it.
//
//   npm run build && npm run test:ui
//
// The Tauri IPC is stubbed, so this checks the *decisions* the UI makes — when
// to start a drag, which recipe it asks for, what it claims afterwards — not
// the native drag itself. That part is platform code and has to be tried by
// hand.
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
await new Promise((r) => server.listen(4607, r))

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

function stub(outcome) {
  const NAMES = [
    ['builtin.espresso', 'Espresso', 'Reality Shot', 'espresso'],
    ['builtin.cappuccino', 'Cappuccino', 'Human Touch', 'cappuccino'],
    ['builtin.americano', 'Americano', 'Pressure Test', 'americano'],
    ['builtin.cold-brew', 'Cold Brew', 'Fresh Eyes', 'cold-brew'],
  ]
  const RECIPES = NAMES.map(([id, name, purpose, icon], i) => ({
    id, name, purpose, icon, accent: 'espresso',
    explanation: `What ${name} does.`,
    enabled: true, order: i, builtin: true, modified: false,
    fileName: `☕ ${name} - ${purpose}.md`,
  }))
  window.__calls = []
  window.__TAURI_INTERNALS__ = {
    transformCallback: (f) => { const k = '__cb' + Math.random().toString(36).slice(2); window[k] = f; return k },
    metadata: { currentWindow: { label: 'main' }, currentWebview: { label: 'main' } },
    invoke: async (cmd, args) => {
      window.__calls.push([cmd, args])
      switch (cmd) {
        case 'list_recipes': return RECIPES
        case 'get_settings':
          return { alwaysOnTop: false, showTray: true, launchAtLogin: false, selectedRecipe: null, seenIntro: true }
        case 'icon_presets': return [{ id: 'espresso', label: 'Espresso cup', value: '☕' }]
        case 'accent_presets': return [{ id: 'espresso', label: 'espresso', value: '#8C5A3B' }]
        case 'pour': return outcome
        default: return null
      }
    },
  }
}

async function session(outcome = 'dropped') {
  const page = await browser.newPage({ viewport: { width: 280, height: 330 } })
  await page.addInitScript(stub, outcome)
  await page.goto('http://localhost:4607/')
  await page.waitForSelector('.cup-grab')
  await page.evaluate(() => { window.__calls.length = 0 })
  return page
}

const pours = (page) => page.evaluate(() => window.__calls.filter((c) => c[0] === 'pour'))
const centreOf = async (page, selector) => {
  const b = await page.locator(selector).first().boundingBox()
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}

console.log('the drag:')

// 1. A plain click must NOT start a drag.
{
  const page = await session()
  const c = await centreOf(page, '.cup-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 1, c.y + 1) // inside the 4px threshold
  await page.mouse.up()
  await page.waitForTimeout(250)
  check('a click leaves the cup alone', (await pours(page)).length, 0)
  await page.close()
}

// 2. Press and drag past the threshold pours exactly one shot, of the coffee
//    that is actually selected.
{
  const page = await session('dropped')
  const c = await centreOf(page, '.cup-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 10 })
  await page.waitForTimeout(250)
  check('dragging pours one shot', await pours(page), [['pour', { recipeId: 'builtin.espresso' }]])
  check('and says so', await page.textContent('.explain'), 'Served. Send the message.')
  await page.mouse.up()
  await page.close()
}

// 3. A cancelled drag must not claim success.
{
  const page = await session('cancelled')
  const c = await centreOf(page, '.cup-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 10 })
  await page.waitForTimeout(250)
  check('a cancelled drag claims nothing', await page.textContent('.explain'), 'What Espresso does.')
  await page.mouse.up()
  await page.close()
}

// 4. A move with no button held disarms, and stays disarmed.
{
  const page = await session()
  const c = await centreOf(page, '.cup-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.locator('.cup-grab').dispatchEvent('pointermove', { pointerId: 1, clientX: c.x + 40, clientY: c.y + 40, buttons: 0 })
  await page.waitForTimeout(120)
  check('a released pointer disarms the cup', (await pours(page)).length, 0)
  await page.locator('.cup-grab').dispatchEvent('pointermove', { pointerId: 1, clientX: c.x + 80, clientY: c.y + 80, buttons: 1 })
  await page.waitForTimeout(120)
  check('and stays disarmed afterwards', (await pours(page)).length, 0)
  await page.mouse.up()
  await page.close()
}

// 5. ONLY the cup drags a file out. Everything else is an ordinary control.
{
  const page = await session()
  for (const [what, selector] of [
    ['the header', '.bar__grip'],
    ['an arrow', '.picker__arrow'],
    ['the machine', '.machine'],
    ['a dot', '.dot'],
  ]) {
    const c = await centreOf(page, selector)
    await page.mouse.move(c.x, c.y)
    await page.mouse.down()
    await page.mouse.move(c.x + 40, c.y - 30, { steps: 8 })
    await page.mouse.up()
    await page.waitForTimeout(120)
    check(`dragging ${what} pours nothing`, (await pours(page)).length, 0)
  }
  await page.close()
}

console.log('the carousel:')

// 6. Arrows, dots and the keyboard all move through the menu.
{
  const page = await session()
  check('starts on the first coffee', await page.textContent('.picker__name'), 'Espresso')

  await page.click('.picker__arrow[title="Next coffee"]')
  check('the right arrow moves on', await page.textContent('.picker__name'), 'Cappuccino')

  await page.click('.picker__arrow[title="Previous coffee"]')
  await page.click('.picker__arrow[title="Previous coffee"]')
  check('the left arrow wraps around', await page.textContent('.picker__name'), 'Cold Brew')

  await page.keyboard.press('ArrowRight')
  check('the keyboard wraps too', await page.textContent('.picker__name'), 'Espresso')

  await page.locator('.dot').nth(2).click()
  check('a dot jumps straight there', await page.textContent('.picker__name'), 'Americano')
  check('the explanation follows the coffee', await page.textContent('.explain'), 'What Americano does.')
  await page.close()
}

// 7. Whichever coffee is showing is the one that gets poured.
{
  const page = await session()
  await page.click('.picker__arrow[title="Next coffee"]')
  await page.click('.picker__arrow[title="Next coffee"]')
  const c = await centreOf(page, '.cup-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 10 })
  await page.waitForTimeout(250)
  check('the selected coffee is what pours', await pours(page), [['pour', { recipeId: 'builtin.americano' }]])
  await page.mouse.up()
  await page.close()
}

// 8. Arrow keys must not fight a text field.
{
  const page = await session()
  await page.click('.bar__btn[title="Settings and recipes"]')
  await page.click('text=Manage recipes')
  await page.click('[aria-label="Edit Espresso"]')
  await page.waitForSelector('.field input')
  await page.locator('.field input').first().fill('Ristretto')
  await page.locator('.field input').first().press('ArrowLeft')
  await page.locator('.field input').first().press('ArrowLeft')
  check('typing is not hijacked by the carousel', await page.inputValue('.field input'), 'Ristretto')
  await page.close()
}

console.log('the panels:')

// 9. The full prompt never appears until the editor is opened.
{
  const page = await session()
  const onScreen = await page.evaluate(() => document.body.innerText)
  check('no prompt body on the main screen', /intentionally selected this Qahwa recipe/.test(onScreen), false)
  await page.close()
}

// 10. Escape closes a panel.
{
  const page = await session()
  await page.click('.bar__btn[title="About Qahwa"]')
  check('the info panel opens', await page.locator('.sheet').isVisible(), true)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(150)
  check('escape closes it', await page.locator('.sheet').count(), 0)
  await page.close()
}

// 11. Deleting asks first.
{
  const page = await session()
  await page.click('.bar__btn[title="Settings and recipes"]')
  await page.click('text=Manage recipes')
  check('built-ins offer no delete button', await page.locator('[aria-label^="Delete"]').count(), 0)
  await page.close()
}

await browser.close()
server.close()
console.log(failures ? `\n${failures} failing` : '\nall passing')
process.exit(failures ? 1 : 0)
