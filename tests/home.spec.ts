import { expect, test } from '@playwright/test'

test('has the correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('timomeh.de')
})

test('lists all tags', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation').getByRole('link')).not.toHaveCount(
    0,
  )
})

test('has an active everything tag by default', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('navigation').getByRole('link').first(),
  ).toHaveText('Everything')
  await expect(
    page.getByRole('navigation').getByRole('link').first(),
  ).toHaveAttribute('data-current', 'true')
})

test('can navigate to the next year', async ({ page }) => {
  await page.goto('/')
  await page.click('a[href^="/in/"]')
  await expect(page).toHaveTitle(/20\d{2} \| timomeh\.de/)
})
