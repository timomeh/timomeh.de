import playwrightLamdba from 'playwright-aws-lambda'
import playwrightDev from 'playwright'

async function launchPlaywright() {
  if (process.env.NODE_ENV === 'production') {
    return playwrightLamdba.launchChromium()
  } else {
    return playwrightDev.chromium.launch()
  }
}

export async function screenshot(url: string) {
  const browser = await launchPlaywright()
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  const image = await page.screenshot({ type: 'png' })

  await browser.close()
  return image
}
