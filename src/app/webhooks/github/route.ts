import { Webhooks } from '@octokit/webhooks'
import {
  DiscussionCategoryChangedEvent,
  DiscussionCreatedEvent,
  DiscussionDeletedEvent,
  DiscussionEditedEvent,
  DiscussionLabeledEvent,
  DiscussionUnlabeledEvent,
  EventPayloadMap,
  LabelCreatedEvent,
  LabelDeletedEvent,
  LabelEditedEvent,
} from '@octokit/webhooks-types'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { isTag, labelNameToSlug } from '@/lib/blog'
import { isAllowedCategory } from '@/lib/github'

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks({
    secret: process.env.GITHUB_WEBHOOK_SECRET as string,
  })

  const body = await request.text()

  webhooks.onError((error) => {
    console.error('Error when processing webhook:')
    console.error(error)
  })

  const event = request.headers.get('x-github-event') as keyof EventPayloadMap

  const verified = await webhooks
    .verifyAndReceive({
      id: request.headers.get('x-github-delivery') as string,
      name: event,
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

  if (event !== 'discussion' && event !== 'label') {
  }

  if (event === 'label') {
    await onLabelEvent(body)

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    })
  }

  if (event === 'discussion') {
    await onDiscussionEvent(body)

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    })
  }

  return NextResponse.json(
    {
      revalidated: false,
      now: Date.now(),
      message: 'Unsupported event.',
    },
    { status: 401 },
  )
}

async function onLabelEvent(body: string) {
  const data = JSON.parse(body) as
    | LabelCreatedEvent
    | LabelDeletedEvent
    | LabelEditedEvent

  if (data.action === 'created') {
    // do nothing. A created label has no effect
  }

  if (data.action === 'deleted' && isTag(data.label.name)) {
    revalidateTag('tags/all')
  }

  if (data.action === 'edited') {
    if (data.changes?.name?.from && isTag(data.changes.name.from)) {
      revalidateTag(`tag/slug:${labelNameToSlug(data.changes.name.from)}`)
    }

    if (isTag(data.label.name)) {
      revalidateTag(`tag/slug:${labelNameToSlug(data.label.name)}`)
    }
  }
}

async function onDiscussionEvent(body: string) {
  const data = JSON.parse(body) as
    | DiscussionCreatedEvent
    | DiscussionLabeledEvent
    | DiscussionLabeledEvent
    | DiscussionUnlabeledEvent
    | DiscussionCategoryChangedEvent
    | DiscussionEditedEvent
    | DiscussionDeletedEvent

  if (data.action === 'category_changed') {
    if (
      isAllowedCategory(data.discussion.category.slug) &&
      isAllowedCategory(data.changes.category.from.slug)
    ) {
      // Do nothing. The post just changed from one supported category to the
      // next. I don't separate between allowed categories right now.
      return
    }

    // The post was made either public or unlisted.

    revalidateTag(`post/slug:${data.discussion.title}`)
    revalidateTag('feeds')
  }

  if (data.action === 'created') {
    revalidateTag('posts/all')
    revalidateTag('feeds')
  }

  if (data.action === 'deleted') {
    revalidateTag(`post/slug:${data.discussion.title}`)
    revalidateTag('posts/all')
    revalidateTag('feeds')
  }

  if (data.action === 'edited') {
    revalidateTag(`post/slug:${data.discussion.title}`)
    revalidateTag('feeds')
  }

  if (data.action === 'labeled') {
    revalidateTag(`post/slug:${data.discussion.title}`)
  }

  if (data.action === 'unlabeled') {
    revalidateTag(`post/slug:${data.discussion.title}`)
  }
}
