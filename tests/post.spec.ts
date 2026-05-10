import { argosScreenshot } from '@argos-ci/playwright'
import { expect, test } from '@playwright/test'

test('renders the first post correctly', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')
  await page.waitForLoadState('networkidle')

  await argosScreenshot(page, 'posts/how-to-build-a-blog', {
    fullPage: true,
    timeout: 60_000,
  })
})

test('has the correct title', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')
  await expect(page).toHaveTitle('How to Build a Blog | timomeh.de')
})

test('renders the content', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')

  expect(
    page.getByRole('paragraph', { name: 'When I was a teen, I learned' }),
  ).toBeDefined()
})

test('uses internal links in post', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')

  await expect(page.getByRole('link', { name: 'Part 2' })).toHaveAttribute(
    'href',
    '/posts/how-i-built-this-blog',
  )
})
