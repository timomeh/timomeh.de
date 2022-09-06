import chromium from 'chrome-aws-lambda'

export async function screenshot(url: string) {
  let browser = null

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 630 })
    await page.goto(url)
    await page.waitForNetworkIdle()
    const image = await page.screenshot({ type: 'png', encoding: 'binary' })

    await browser.close()
    return image
  } catch (error) {
    await browser?.close()
    throw error
  }
}
