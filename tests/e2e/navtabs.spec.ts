import { test, expect } from '@playwright/test'

// Live path
const PATH = '/hi/finance'
const mainTablist = (page: any) => page.locator('[role="tablist"][aria-label="Amogh sections"]')
const compactTablist = (page: any) => page.locator('[role="tablist"][aria-label="Amogh sections (compact)"]')
async function getVisibleTablist(page: any) {
  // ensure both are resolved
  await page.waitForSelector('[role="tablist"]')
  if (await mainTablist(page).isVisible()) return mainTablist(page)
  return compactTablist(page)
}

test('bar is centered content-width', async ({ page }) => {
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' })
  await page.goto(PATH)
  await page.waitForSelector('[role="tablist"]')
  const bar = await getVisibleTablist(page)
  await expect(bar).toBeVisible()
  const box = await bar.boundingBox()
  const vw = await page.evaluate(() => window.innerWidth)
  const left = (vw - (box?.width || 0)) / 2
  expect(Math.abs((box?.x || 0) - left)).toBeLessThan(3)
})

test('keyboard navigation moves active', async ({ page }) => {
  await page.goto(PATH)
  const bar = await getVisibleTablist(page)
  await expect(bar).toBeVisible()
  const firstTab = bar.getByRole('tab').first()
  await firstTab.focus()
  await page.keyboard.press('ArrowRight')
  // assert that some tab becomes selected within the same bar
  const selected = bar.locator('[role="tab"][aria-selected="true"]').first()
  await expect(selected).toBeVisible()
})


