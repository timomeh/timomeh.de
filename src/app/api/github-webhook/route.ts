import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { Webhooks } from '@octokit/webhooks'
import {
  DiscussionCreatedEvent,
  DiscussionEditedEvent,
} from '@octokit/webhooks-types'
import { getCategoryNameFromId } from '@/lib/github'

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_WEBHOOK_SECRET as string,
  })

  const body = await request.text()

  const signatureSha256 = request.headers.get('x-hub-signature-256') as string
  const verified = await webhooks.verify(body, signatureSha256)

  if (!verified) {
    return NextResponse.json(
      {
        revalidated: false,
        now: Date.now(),
        message: 'Unverified',
      },
      { status: 401 }
    )
  }

  const data = JSON.parse(body) as
    | DiscussionCreatedEvent
    | DiscussionEditedEvent

  if (!data.discussion) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      message: 'Not a discussion event',
    })
  }

  const category = getCategoryNameFromId(
    // @ts-expect-error wrong types lol
    data.discussion.category.node_id as unknown as string
  )

  if (!category) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      message: 'Category is not handled',
    })
  }

  const slug = data.discussion.title
  const tags = [category, `${category}/${slug}`]
  for (const tag of tags) {
    revalidateTag(tag)
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    message: 'Revalidated tags',
    tags,
  })
}
