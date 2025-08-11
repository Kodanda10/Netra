import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/finance**', async (route) => {
    const url = new URL(route.request().url())
    const scope = url.searchParams.get('scope') || 'bharat'
    const now = new Date().toISOString()
    const mk = (n: number, prefix: string) => Array.from({ length: n }).map((_, i) => ({
      title: `${prefix} headline ${i + 1}`,
      url: `https://example.com/${prefix}/${i + 1}`,
      publishedAt: now,
      source: i % 2 === 0 ? 'rss' : 'gnews',
    }))
    const items = scope === 'bharat' ? mk(30, 'bharat') : mk(10, 'state')
    const body = JSON.stringify({ items, sources: [{ source: 'rss', count: 20 }, { source: 'gnews', count: 10 }], updatedAt: now })
    await route.fulfill({ status: 200, contentType: 'application/json', body })
  })
})

test('bar is centered content-width', async ({ page }) => {
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.goto('/')
  // header mounts tabs inside; wait for it
  await page.waitForSelector('[role="tablist"]')
  const bar = page.locator('[role="tablist"]').first()
  await expect(bar).toBeVisible()
  const box = await bar.boundingBox()
  const vw = await page.evaluate(() => window.innerWidth)
  const left = (vw - (box?.width || 0)) / 2
  expect(Math.abs((box?.x || 0) - left)).toBeLessThan(3)
})

test('keyboard navigation moves active', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="tab-news"]')
  await page.getByTestId('tab-news').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('tab-stocks')).toHaveAttribute('aria-selected', 'true')
})


