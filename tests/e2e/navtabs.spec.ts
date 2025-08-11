import { test, expect } from '@playwright/test'

test('nav bar renders and is centered', async ({ page }) => {
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.goto('/')

test('bar is centered content-width', async ({ page }) => {
  const bar = page.locator('[role="tablist"]').first()
  await expect(bar).toBeVisible()
  const box = await bar.boundingBox()
  const vw = await page.evaluate(() => window.innerWidth)
  const left = (vw - (box?.width || 0)) / 2
  expect(Math.abs((box?.x || 0) - left)).toBeLessThan(3)
})

test('keyboard navigation moves active', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('tab-finance-news').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('tab-stocks')).toHaveAttribute('aria-selected', 'true')
})


