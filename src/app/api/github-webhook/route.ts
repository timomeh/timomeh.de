import { Webhooks } from '@octokit/webhooks'
import {
  DiscussionCreatedEvent,
  DiscussionEditedEvent,
} from '@octokit/webhooks-types'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_WEBHOOK_SECRET as string,
  })

  const body = await request.text()

  webhooks.onError((error) => {
    console.error('Error when processing webhook:')
    console.error(error)
  })

  const verified = await webhooks
    .verifyAndReceive({
      id: request.headers.get('x-github-delivery') as string,
      // @ts-expect-error
      name: request.headers.get('x-github-event') as string,
      signature: request.headers.get('x-hub-signature-256') as string,
      payload: body,
    })
    .then(() => true)
    .catch((error) => {
      console.error(error)
      return false
    })

  if (!verified) {
    return NextResponse.json(
      {
        revalidated: false,
        now: Date.now(),
        message: 'Unverified',
      },
      { status: 401 },
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

  const slug = data.discussion.title
  const tags = ['posts', slug, 'labels']
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
