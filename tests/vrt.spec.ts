import { argosScreenshot } from '@argos-ci/playwright'
import { test } from '@playwright/test'

test.beforeAll(async ({ request }) => {
  await request.get('/webhooks/nuke?soft=true')
})

test('renders code', async ({ page }) => {
  await page.goto('/vrt-shiki')
  await argosScreenshot(page, 'shiki', {
    timeout: 30_000,
    fullPage: true,
    viewports: ['iphone-se2', 'macbook-15'],
  })
})

test('renders markdown', async ({ page }) => {
  await page.goto('/vrt-markdown')
  await argosScreenshot(page, 'markdown', {
    timeout: 30_000,
    fullPage: true,
    viewports: ['iphone-se2', 'macbook-15'],
  })
})
