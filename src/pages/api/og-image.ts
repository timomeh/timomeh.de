import type { NextApiRequest, NextApiResponse } from 'next'
import { getBlogPost } from '../../lib/blog'
import { screenshot } from '../../lib/screenshot'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const post = await getBlogPost(req.query.slug!.toString())

  if (!post) {
    res.status(404).send('Not found')
    return
  }

  const title = encodeURIComponent(post.rawTitle)
  const url = 'https://timomeh.de/og-image/post?title='.concat(title)
  const image = await screenshot(url)

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate')
  res.write(image)
  res.end()
}
