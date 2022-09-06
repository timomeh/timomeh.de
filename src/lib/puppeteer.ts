import puppeteerProd from 'puppeteer-core'
import puppeteerDev from 'puppeteer'
import chrome from 'chrome-aws-lambda'

const puppeteer =
  process.env.NODE_ENV === 'production' ? puppeteerProd : puppeteerDev

export async function launchPuppeteer() {
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === 'production'
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {}
  )

  return browser
}
