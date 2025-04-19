import { expect, test } from '@playwright/test'

test('has the correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('timomeh.de')
})

test('can navigate to the next year', async ({ page }) => {
  await page.goto('/')
  await page.click(`a[href^="/in/${new Date().getFullYear() - 1}"]`)
  await expect(page).toHaveTitle(/20\d{2} \| timomeh\.de/)
})
