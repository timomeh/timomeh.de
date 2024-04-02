import { argosScreenshot } from '@argos-ci/playwright'
import { expect, test } from '@playwright/test'

test('renders correctly', async ({ page }) => {
  await page.goto('/tag/__test')
  await page.waitForLoadState('networkidle')
  await argosScreenshot(page, 'tag/test', {
    fullPage: true,
    timeout: 60_000,
  })
})

test('has the correct title', async ({ page }) => {
  await page.goto('/tag/software-engineering')
  await expect(page).toHaveTitle('Software Engineering | timomeh.de')
})

test('navigates to a tag', async ({ page }) => {
  await page.goto('/')

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Software Engineering' })
    .click()
  await expect(
    page
      .getByRole('navigation')
      .getByRole('link', { name: 'Software Engineering' }),
  ).toHaveAttribute('data-current', 'true')

  expect(page.url()).toMatch(/\/tag\/software-engineering$/)
})

test('has only the articles with the tag', async ({ page }) => {
  await page.goto('/tag/software-engineering')

  for (const article of await page.getByRole('article').all()) {
    await expect(article).toHaveText(/Software Engineering/)
  }
})
