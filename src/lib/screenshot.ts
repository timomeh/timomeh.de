import playwright from 'playwright'

export async function screenshot(url: string) {
  const browser = await playwright.chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  const image = await page.screenshot({ type: 'png' })

  await browser.close()
  return image
}
