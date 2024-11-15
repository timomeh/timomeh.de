import { expect, test } from '@playwright/test'

test('has the correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('timomeh.de')
})

test('lists articles', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('article')).not.toHaveCount(0)
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
