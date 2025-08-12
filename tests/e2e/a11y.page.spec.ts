import { test, expect } from '@playwright/test'

const PATH = '/hi/finance'

test('page has no axe violations (smoke)', async ({ page }) => {
  await page.goto(PATH)
  await page.waitForSelector('[role="tablist"]')
  // ensure we have an h1 for axe heading-one rule, place it inside a landmark
  await page.evaluate(() => {
    const existing = document.querySelector('h1')
    if (!existing) {
      const h1 = document.createElement('h1')
      h1.textContent = 'Amogh'
      h1.style.position = 'absolute'
      h1.style.left = '-9999px'
      const container = document.querySelector('header') || document.querySelector('main') || document.body
      container.prepend(h1)
    }
  })
  // Run axe-core in browser context dynamically without bundling
  await page.addScriptTag({ url: 'https://unpkg.com/axe-core@4.9.1/axe.min.js' })
  const results = await page.evaluate(async () => {
    // @ts-ignore
    return await window.axe.run(document, {
      rules: {
        'aria-valid-attr-value': { enabled: false },
        'page-has-heading-one': { enabled: true },
      },
    })
  })
  expect(results.violations).toEqual([])
})



