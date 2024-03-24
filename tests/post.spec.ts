import { expect, test } from '@playwright/test'

test('renders the first post correctly', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')
  await page.waitForLoadState('networkidle')
  for (const img of await page.getByRole('img').all()) {
    if (await img.getAttribute('data-fade-in')) {
      await expect(img).toHaveAttribute('data-loaded', 'true')
    }
  }

  await page.screenshot({
    fullPage: true,
    path: 'playwright-screenshots/post-first.png',
    timeout: 60_000,
  })
})

test('renders the second post correctly', async ({ page }) => {
  await page.goto('/posts/how-i-built-this-blog')
  await page.waitForLoadState('networkidle')
  for (const img of await page.getByRole('img').all()) {
    if (await img.getAttribute('data-fade-in')) {
      await expect(img).toHaveAttribute('data-loaded', 'true')
    }
  }

  await page.screenshot({
    fullPage: true,
    path: 'playwright-screenshots/post-second.png',
    timeout: 60_000,
  })
})

test('has the correct title', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')
  await expect(page).toHaveTitle('How to Build a Blog | timomeh.de')
})

test('navigates from home to a post', async ({ page }) => {
  await page.goto('/')

  await page.click('text=How to Build a Blog')
  await expect(
    page.getByRole('heading', { level: 1, name: 'How to Build a Blog' }),
  ).toBeInViewport()

  expect(page.url()).toMatch(/\/posts\/how-to-build-a-blog$/)
})

test('navigates from a post back', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')

  await page.getByRole('link', { name: /Back$/ }).click()
  await expect(page).toHaveTitle('timomeh.de')
  expect(new URL(page.url()).pathname).toBe('/')
})

test('navigates to the next article', async ({ page }) => {
  await page.goto('/posts/how-to-build-a-blog')

  expect(
    page.getByRole('heading', {
      name: 'How I Built this Blog with GitHub Discussions',
    }),
  ).toBeDefined()
  await page
    .getByRole('heading', {
      name: 'How I Built this Blog with GitHub Discussions',
    })
    .click()
  await expect(page).toHaveTitle(
    'How I Built this Blog with GitHub Discussions | timomeh.de',
  )

  expect(page.url()).toMatch(/\/posts\/how-i-built-this-blog$/)
})

test('navigates to the previous article', async ({ page }) => {
  await page.goto('/posts/how-i-built-this-blog')

  await page
    .getByRole('heading', {
      name: 'How to Build a Blog',
    })
    .click()
  await expect(page).toHaveTitle('How to Build a Blog | timomeh.de')

  expect(page.url()).toMatch(/\/posts\/how-to-build-a-blog$/)
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
