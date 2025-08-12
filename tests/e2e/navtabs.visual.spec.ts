import { test, expect } from '@playwright/test'

const PATH = '/hi/finance'
const mainTablist = (page: any) => page.locator('[role="tablist"][aria-label="Amogh sections"]')
const compactTablist = (page: any) => page.locator('[role="tablist"][aria-label="Amogh sections (compact)"]')
async function getVisibleTablist(page: any) {
  await page.waitForSelector('[role="tablist"]')
  if (await mainTablist(page).isVisible()) return mainTablist(page)
  return compactTablist(page)
}

test.describe('NavTabs visual and console hygiene', () => {
  test('no console errors/warnings and visual snapshot DPR 1/2', async ({ page, browserName }) => {
    // against live: do not stub network
    const messages: string[] = []
    page.on('console', (msg) => {
      const t = msg.type()
      if (t === 'error' || t === 'warning') messages.push(`${t}: ${msg.text()}`)
    })

    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
    await page.goto(PATH)
    await page.waitForSelector('[role="tablist"]')

    expect(messages, `Console should be clean on ${browserName}`).toEqual([])

    const bar = await getVisibleTablist(page)
    await expect(bar).toBeVisible()
    await expect(bar).toHaveScreenshot('navtabs-bar-dpr1.png', { maxDiffPixelRatio: 0.35 })

    await page.setViewportSize({ width: 1200, height: 800 })
    await page.emulateMedia({ media: 'screen' })
    await page.setExtraHTTPHeaders({ DPR: '2' })
    await expect(bar).toHaveScreenshot('navtabs-bar-dpr2.png', { maxDiffPixelRatio: 0.35 })
  })
})



