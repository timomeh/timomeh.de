import { expect, test } from '@playwright/test'

test('navigates from home to about', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Timo Mämecke')
  await expect(page).toHaveTitle('Hi, I’m Timo 👋 | timomeh.de')
  expect(
    page.getByRole('heading', { level: 1, name: 'Hi, I’m Timo 👋' }),
  ).toBeDefined()

  expect(page.url()).toMatch(/\/about$/)
})

test('navigates from a post back', async ({ page }) => {
  await page.goto('/about')

  await page.getByRole('link', { name: /Back$/ }).click()
  await expect(page).toHaveTitle('timomeh.de')
  expect(new URL(page.url()).pathname).toBe('/')
})

test('renders the about page', async ({ page }) => {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')
  await page.screenshot({
    fullPage: true,
    path: 'playwright-screenshots/about.png',
    timeout: 60_000,
  })
})

test('renders the feeds page', async ({ page }) => {
  await page.goto('/feeds')
  await page.waitForLoadState('networkidle')
  await page.screenshot({
    fullPage: true,
    path: 'playwright-screenshots/feeds.png',
    timeout: 60_000,
  })
})

test('renders the imprint page', async ({ page }) => {
  await page.goto('/impressum')
  await page.waitForLoadState('networkidle')
  await page.screenshot({
    fullPage: true,
    path: 'playwright-screenshots/impressum.png',
    timeout: 60_000,
  })
})
