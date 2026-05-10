import { argosScreenshot } from '@argos-ci/playwright'
import { test } from '@playwright/test'

test('renders the about page', async ({ page }) => {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')
  await argosScreenshot(page, 'page/about', {
    fullPage: true,
    timeout: 60_000,
  })
})

test('renders the feeds page', async ({ page }) => {
  await page.goto('/feeds')
  await page.waitForLoadState('networkidle')
  await argosScreenshot(page, 'page/feeds', {
    fullPage: true,
    timeout: 60_000,
  })
})

test('renders the imprint page', async ({ page }) => {
  await page.goto('/impressum')
  await page.waitForLoadState('networkidle')
  await argosScreenshot(page, 'page/imprint', {
    fullPage: true,
    timeout: 60_000,
  })
})
