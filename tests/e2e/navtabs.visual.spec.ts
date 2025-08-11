import { test, expect } from '@playwright/test'

test.describe('NavTabs visual and console hygiene', () => {
  test('no console errors/warnings and visual snapshot DPR 1/2', async ({ page, browserName }) => {
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



