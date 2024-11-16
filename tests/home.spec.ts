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

test('can navigate to the next page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Older →')
  await page.waitForLoadState('networkidle')
  expect(page.url()).toMatch(/\/page\/1$/)
  await expect(page).toHaveTitle('Page 1 | timomeh.de')
})
