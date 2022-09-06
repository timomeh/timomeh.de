import { chromium } from 'playwright-core'
import lambdaChromium from 'chrome-aws-lambda'

export async function screenshot(url: string) {
  const browser = await chromium.launch({
    executablePath: await lambdaChromium.executablePath,
    args: lambdaChromium.args,
  })
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  const image = await page.screenshot({ type: 'png' })

  await browser.close()
  return image
}
