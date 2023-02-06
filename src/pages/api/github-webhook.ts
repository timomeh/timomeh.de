import { Webhooks } from '@octokit/webhooks'
import {
  DiscussionCreatedEvent,
  DiscussionEditedEvent,
} from '@octokit/webhooks-types'
import type { NextApiRequest, NextApiResponse } from 'next'

import { listOfftopicsPaginated, listPostsPaginated } from '@/lib/blog'
import { getCategoryNameFromId } from '@/lib/github'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_WEBHOOK_SECRET as string,
  })

  const signatureSha256 = req.headers['x-hub-signature-256'] as string
  const verified = await webhooks.verify(req.body as string, signatureSha256)

  if (!verified) {
    res.status(401).json({ ok: false, hint: 'Unverified' })
    return
  }

  const data = JSON.parse(req.body) as
    | DiscussionCreatedEvent
    | DiscussionEditedEvent

  if (!data.discussion) {
    res.status(401).json({ ok: false, hint: 'Not a discussion event' })
    return
  }

  const category = getCategoryNameFromId(
    // @ts-expect-error wrong types lol
    data.discussion.category.node_id as unknown as string
  )

  if (!category) {
    res.status(200).json({
      ok: true,
      revalidated: [],
      hint: 'Category is not handled',
    })
    return
  }

  const listEntires = {
    posts: listPostsPaginated,
    offtopic: listOfftopicsPaginated,
  }

  const { pages } = await listEntires[category]()
  const slug = data.discussion.title

  const listUrls = Array.from(Array(pages)).map(
    (_, i) => `/${category}/page/${i + 1}`
  )
  const urls = [...listUrls, `/${category}/${slug}`]
  const feedUrls = ['rss', 'atom', 'json'].map(
    (type) => `https://timomeh.de/${category}/feed.type`
  )

  await Promise.allSettled([
    ...urls.map((url) => res.revalidate(url)),
    ...feedUrls.map((url) => fetch(url)),
  ])

  res.status(200).json({
    ok: true,
    hint: 'Revalidated pages',
    revalidated: [...urls, ...feedUrls],
  })
}
