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
import { fileURLToPath } from 'node:url'

// `new URL(...).pathname` would be '/D:/a/...' on Windows — the drive letter
// becomes a directory name and nothing is ever found. fileURLToPath is the
// only conversion that is right on every platform.
const ROOT = fileURLToPath(new URL('../dist', import.meta.url))
if (!fs.existsSync(path.join(ROOT, 'index.html'))) {
  console.error(`No dist/ to test at ${ROOT}. Run \`npm run build\` first.`)
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
    ['builtin.latte', 'Latte', 'Second Opinion', 'latte'],
    ['builtin.americano', 'Americano', 'The Challenger', 'americano'],
  ]
  const RECIPES = NAMES.map(([id, name, purpose, icon], i) => ({
    id, name, purpose, icon, accent: 'espresso',
    explanation: `What ${name} does.`,
    enabled: true, order: i, builtin: true, modified: false,
    fileName: `${purpose}.md`,
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
        case 'icon_presets': return [{ id: 'espresso', label: 'Espresso cup', value: 'espresso' }]
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
  await page.waitForSelector('.drink-grab')
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
  const c = await centreOf(page, '.drink-grab')
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
  const c = await centreOf(page, '.drink-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 10 })
  await page.waitForTimeout(250)
  check('dragging pours one shot', await pours(page), [['pour', { recipeId: 'builtin.espresso' }]])
  check('and says so', await page.textContent('.instruct'), 'Served. Send the message.')
  await page.mouse.up()
  await page.close()
}

// 3. A cancelled drag must not claim success.
{
  const page = await session('cancelled')
  const c = await centreOf(page, '.drink-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 10 })
  await page.waitForTimeout(250)
  check('a cancelled drag claims nothing', await page.textContent('.instruct'), 'Drag your coffee into an AI chat.')
  await page.mouse.up()
  await page.close()
}

// 4. A move with no button held disarms, and stays disarmed.
{
  const page = await session()
  const c = await centreOf(page, '.drink-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.locator('.drink-grab').dispatchEvent('pointermove', { pointerId: 1, clientX: c.x + 40, clientY: c.y + 40, buttons: 0 })
  await page.waitForTimeout(120)
  check('a released pointer disarms the cup', (await pours(page)).length, 0)
  await page.locator('.drink-grab').dispatchEvent('pointermove', { pointerId: 1, clientX: c.x + 80, clientY: c.y + 80, buttons: 1 })
  await page.waitForTimeout(120)
  check('and stays disarmed afterwards', (await pours(page)).length, 0)
  await page.mouse.up()
  await page.close()
}

// 5. ONLY the cup drags a file out. Everything else is an ordinary control.
{
  const page = await session()
  for (const [what, selector] of [
    ['the header', '.bar__spacer'],
    ['an arrow', '.arrow'],
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
  check('starts on the first coffee', await page.textContent('.drink-name'), 'Espresso')

  await page.click('.arrow[title="Next coffee"]')
  check('the right arrow moves on', await page.textContent('.drink-name'), 'Cappuccino')

  await page.click('.arrow[title="Previous coffee"]')
  await page.click('.arrow[title="Previous coffee"]')
  check('the left arrow wraps around', await page.textContent('.drink-name'), 'Americano')

  await page.keyboard.press('ArrowRight')
  check('the keyboard wraps too', await page.textContent('.drink-name'), 'Espresso')

  await page.locator('.dot').nth(2).click()
  check('a dot jumps straight there', await page.textContent('.drink-name'), 'Latte')
  check('the explanation follows the coffee', await page.textContent('.drink-explain'), 'What Latte does.')
  await page.close()
}

// 7. Whichever coffee is showing is the one that gets poured.
{
  const page = await session()
  await page.click('.arrow[title="Next coffee"]')
  await page.click('.arrow[title="Next coffee"]')
  const c = await centreOf(page, '.drink-grab')
  await page.mouse.move(c.x, c.y)
  await page.mouse.down()
  await page.mouse.move(c.x + 40, c.y - 30, { steps: 10 })
  await page.waitForTimeout(250)
  check('the selected coffee is what pours', await pours(page), [['pour', { recipeId: 'builtin.latte' }]])
  await page.mouse.up()
  await page.close()
}

// 8. Arrow keys must not fight a text field.
{
  const page = await session()
  await page.click('.bar__btn[title="Settings"]')
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
  await page.click('.bar__btn[title="Help"]')
  check('the info panel opens', await page.locator('.sheet').isVisible(), true)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(150)
  check('escape closes it', await page.locator('.sheet').count(), 0)
  await page.close()
}

// 11. Deleting asks first.
{
  const page = await session()
  await page.click('.bar__btn[title="Settings"]')
  await page.click('text=Manage recipes')
  check('nothing can be deleted in this release', await page.locator('[aria-label^="Delete"]').count(), 0)
  check('and nothing can be created', await page.locator('text=New recipe').count(), 0)
  await page.close()
}

console.log('the menu and motion:')

// 12. The four coffees, in the order the product specifies.
{
  const page = await session()
  const seen = []
  for (let i = 0; i < 4; i++) {
    seen.push([await page.textContent('.drink-name'), await page.textContent('.drink-purpose')])
    await page.click('.arrow[title="Next coffee"]')
  }
  check('four coffees, in order', seen, [
    ['Espresso', 'Reality Shot'],
    ['Cappuccino', 'Human Touch'],
    ['Latte', 'Second Opinion'],
    ['Americano', 'The Challenger'],
  ])
  check('and it wraps back to the first', await page.textContent('.drink-name'), 'Espresso')
  await page.close()
}

// 13. Hot drinks steam, cold ones do not; cold ones have ice that drifts.
{
  const page = await session()
  const has = async (sel) => (await page.locator(sel).count()) > 0
  check('espresso steams', await has('.steam'), true)
  check('espresso has no ice', await has('.ice'), false)
  await page.click('.arrow[title="Next coffee"]')
  await page.click('.arrow[title="Next coffee"]')
  check('the iced latte does not steam', await has('.steam'), false)
  check('and its ice is there to drift', await has('.ice'), true)
  await page.close()
}

// 14. Reduced motion stills everything that loops.
{
  const page = await browser.newPage({ viewport: { width: 330, height: 440 }, reducedMotion: 'reduce' })
  await page.addInitScript(stub, 'dropped')
  await page.goto('http://localhost:4607/')
  await page.waitForSelector('.drink-grab')
  const steamAnimating = await page.evaluate(() => {
    const el = document.querySelector('.steam path')
    return el ? getComputedStyle(el).animationName : 'none'
  })
  check('no looping steam under reduced motion', steamAnimating, 'none')

  await page.click('.arrow[title="Next coffee"]')
  await page.click('.arrow[title="Next coffee"]')
  const iceAnimating = await page.evaluate(() => {
    const el = document.querySelector('.ice')
    return el ? getComputedStyle(el).animationName : 'missing'
  })
  check('and no drifting ice either', iceAnimating, 'none')
  await page.close()
}

await browser.close()
server.close()
console.log(failures ? `\n${failures} failing` : '\nall passing')
process.exit(failures ? 1 : 0)
