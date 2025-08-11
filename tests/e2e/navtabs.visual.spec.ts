import { test, expect } from '@playwright/test'

test.describe('NavTabs visual and console hygiene', () => {
  test('no console errors/warnings and visual snapshot DPR 1/2', async ({ page, browserName }) => {
    // stub finance API to avoid 500s and console noise
    await page.route('**/api/finance**', async (route) => {
      const now = new Date().toISOString()
      const items = Array.from({ length: 10 }).map((_, i) => ({
        title: `bharat headline ${i + 1}`,
        url: `https://example.com/bharat/${i + 1}`,
        publishedAt: now,
        source: i % 2 === 0 ? 'rss' : 'gnews',
      }))
      const body = JSON.stringify({ items, sources: [{ source: 'rss', count: 6 }, { source: 'gnews', count: 4 }], updatedAt: now })
      await route.fulfill({ status: 200, contentType: 'application/json', body })
    })
    const messages: string[] = []
    page.on('console', (msg) => {
      const t = msg.type()
      if (t === 'error' || t === 'warning') messages.push(`${t}: ${msg.text()}`)
    })

    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
    await page.goto('/')
    await page.waitForSelector('[role="tablist"]')

    expect(messages, `Console should be clean on ${browserName}`).toEqual([])

    await expect(page).toHaveScreenshot('navtabs-dpr1.png', { maxDiffPixelRatio: 0.001 })

    await page.setViewportSize({ width: 1200, height: 800 })
    await page.emulateMedia({ media: 'screen' })
    await page.setExtraHTTPHeaders({ DPR: '2' })
    await expect(page).toHaveScreenshot('navtabs-dpr2.png', { maxDiffPixelRatio: 0.001 })
  })
})



