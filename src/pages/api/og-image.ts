import type { NextApiRequest, NextApiResponse } from 'next'
import { getBlogPost } from '../../lib/blog'
import { launchPuppeteer } from '../../lib/puppeteer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const post = await getBlogPost(req.query.slug!.toString())

  if (!post) {
    res.status(404).send('Not found')
    return
  }

  const browser = await launchPuppeteer()
  const page = await browser.newPage()
  page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
  )

  await page.setViewport({ width: 1200, height: 630 })
  await page.goto(
    `http://localhost:3000/og-image/post?title=${encodeURIComponent(
      post?.rawTitle
    )}`
  )
  await page.waitForNetworkIdle()

  const image = await page.screenshot({ type: 'png', encoding: 'binary' })

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate')
  res.write(image)
  res.end()
}
