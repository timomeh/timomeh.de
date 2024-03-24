import { expect, test } from '@playwright/test'

test('has the correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('timomeh.de')
})

test('shows years', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: '2024', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: '2023', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: '2022', exact: true }),
  ).toBeVisible()
})

test('lists articles', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('article')).not.toHaveCount(0)
  expect(
    page.getByRole('article', { name: /How to Build a Blog/ }),
  ).toBeDefined()
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
