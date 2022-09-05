import type { NextApiRequest, NextApiResponse } from 'next'
import { Webhooks } from '@octokit/webhooks'
import {
  DiscussionCreatedEvent,
  DiscussionEditedEvent,
} from '@octokit/webhooks-types'
import { categoryId, parseDiscussionTitle } from '../../lib/blog'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_WEBHOOK_SECRET as string,
  })

  const signatureSha256 = req.headers['x-hub-signature-256'] as string
  const data = req.body as DiscussionCreatedEvent | DiscussionEditedEvent
  const verified = await webhooks.verify(data, signatureSha256)

  if (!verified) {
    res.status(401).json({ ok: false, hint: 'Unverified' })
  }

  if (!data.discussion) {
    res.status(401).json({ ok: false, hint: 'Not a discussion event' })
  }

  // @ts-expect-error
  const receivedCategoryId: string = data.discussion.category.node_id

  if (receivedCategoryId !== categoryId) {
    res.status(200).json({
      ok: true,
      revalidated: [],
      hint: `Only Blog Post Category ${categoryId} allowed. Received discussion had Category ${receivedCategoryId}`,
    })
  }

  if (data.action === 'created') {
    await res.revalidate('/posts')
    res
      .status(200)
      .json({ ok: true, hint: 'Revalidated pages', revalidated: ['/posts'] })
    return
  }

  if (data.action === 'edited') {
    const { slug } = parseDiscussionTitle(data.discussion.title)
    await res.revalidate('/posts')
    await res.revalidate(`/posts/${slug}`)
    res
      .status(200)
      .json({
        ok: true,
        hint: 'Revalidated pages',
        revalidated: ['/posts', `/posts/${slug}`],
      })
    return
  }
}
