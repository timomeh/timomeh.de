import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.DEV_REVALIDATE !== 'true') {
    res.status(404).send('Not found')
    return
  }

  if (!req.query.url) {
    res.status(400).send('url query param missing')
    return
  }

  const url = req.query.url.toString()
  await res.revalidate(url)
  res.status(200).json({
    ok: true,
    hint: 'Revalidated pages',
    revalidated: [url],
  })
}
