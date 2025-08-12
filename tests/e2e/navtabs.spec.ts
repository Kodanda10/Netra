import { test, expect } from '@playwright/test'

// Live path
const PATH = '/hi/finance'
const mainTablist = (page: any) => page.locator('[role="tablist"][aria-label="Amogh sections"]')

test('bar is centered content-width', async ({ page }) => {
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.goto(PATH)
  await page.waitForSelector('[role="tablist"]')
  const bar = mainTablist(page)
  await expect(bar).toBeVisible()
  const box = await bar.boundingBox()
  const vw = await page.evaluate(() => window.innerWidth)
  const left = (vw - (box?.width || 0)) / 2
  expect(Math.abs((box?.x || 0) - left)).toBeLessThan(3)
})

test('keyboard navigation moves active', async ({ page }) => {
  await page.goto(PATH)
  await page.waitForSelector('[role="tablist"]')
  await page.getByTestId('tab-news').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('tab-stocks')).toHaveAttribute('aria-selected', 'true')
})


