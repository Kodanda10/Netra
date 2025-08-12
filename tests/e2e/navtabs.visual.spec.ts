import { test, expect } from '@playwright/test'

const PATH = '/hi/finance'
const mainTablist = (page: any) => page.locator('[role="tablist"][aria-label="Amogh sections"]')

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

    const bar = mainTablist(page)
    await expect(bar).toBeVisible()
    await expect(bar).toHaveScreenshot('navtabs-bar-dpr1.png', { maxDiffPixelRatio: 0.25 })

    await page.setViewportSize({ width: 1200, height: 800 })
    await page.emulateMedia({ media: 'screen' })
    await page.setExtraHTTPHeaders({ DPR: '2' })
    await expect(bar).toHaveScreenshot('navtabs-bar-dpr2.png', { maxDiffPixelRatio: 0.25 })
  })
})



