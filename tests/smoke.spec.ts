import { expect, test } from '@playwright/test'

test('load all posts', async ({ page }) => {
  test.setTimeout(0)
  await page.goto('/')
  const count = await page.getByRole('article').count()

  for (let i = 0; i < count; i++) {
    await page.goto('/')
    await page.getByRole('article').nth(i).getByRole('link').click()
    await page.waitForLoadState('networkidle', { timeout: 30_000 })
    expect(page.url()).toContain('/posts/')
    await page.reload({ timeout: 30_000 })
    await page.waitForLoadState('networkidle', { timeout: 30_000 })
    expect(page.url()).toContain('/posts/')
  }
})

test('load all tags', async ({ page }) => {
  test.setTimeout(0)
  await page.goto('/')
  const count = await page
    .getByRole('main')
    .getByRole('navigation')
    .getByRole('link')
    .count()

  for (let i = 1; i < count; i++) {
    await page.goto('/')
    await page
      .getByRole('main')
      .getByRole('navigation')
      .getByRole('link')
      .nth(i)
      .click()
    await page.waitForLoadState('networkidle', { timeout: 30_000 })
    expect(page.url()).toContain('/tag/')
    await page.reload({ timeout: 30_000 })
    await page.waitForLoadState('networkidle', { timeout: 30_000 })
    expect(page.url()).toContain('/tag/')
    await page
      .getByRole('main')
      .getByRole('navigation')
      .getByRole('link')
      .first()
      .click()
    expect(page.url()).toBe('https://timomeh.de/')
  }
})

test('load all feeds', async ({ request }) => {
  test.setTimeout(0)
  const json = await request
    .get('https://timomeh.de/posts/feed.json')
    .then((res) => res.text())
  expect(json).toContain('https://jsonfeed.org/version/1')

  const atom = await request
    .get('https://timomeh.de/posts/feed.atom')
    .then((res) => res.text())
  expect(atom).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')

  const rss = await request
    .get('https://timomeh.de/posts/feed.rss')
    .then((res) => res.text())
  expect(rss).toContain('<rss version="2.0"')
})

test('load all pages', async ({ page }) => {
  test.setTimeout(0)

  await page.goto('/')
  await page.getByRole('link', { name: /feeds/i }).first().click()
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  expect(page.url()).toContain('/feeds')
  await page.reload({ timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  expect(page.url()).toContain('/feeds')

  await page.goto('/')
  await page
    .getByRole('link', { name: /imprint/i })
    .first()
    .click()
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  expect(page.url()).toContain('/impressum')
  await page.reload({ timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  expect(page.url()).toContain('/impressum')

  await page.goto('/')
  await page
    .getByRole('link', { name: /privacy policy/i })
    .first()
    .click()
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  expect(page.url()).toContain('/datenschutz')
  await page.reload({ timeout: 30_000 })
  await page.waitForLoadState('networkidle', { timeout: 30_000 })
  expect(page.url()).toContain('/datenschutz')
})
