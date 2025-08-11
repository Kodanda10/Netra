import { test, expect } from '@playwright/test'

test('page has no axe violations (smoke)', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[role="tablist"]')
  // Run axe-core in browser context dynamically without bundling
  await page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.9.1/axe.min.js' })
  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await window.axe.run(document, {
      rules: {
        'aria-valid-attr-value': { enabled: false },
      },
    })
  })
  expect(results.violations).toEqual([])
})



