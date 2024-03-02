import { Webhooks } from '@octokit/webhooks'
import {
  DiscussionCategoryChangedEvent,
  DiscussionCreatedEvent,
  DiscussionDeletedEvent,
  DiscussionEditedEvent,
  DiscussionLabeledEvent,
  DiscussionUnlabeledEvent,
  EventPayloadMap,
} from '@octokit/webhooks-types'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

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

  const verified = await webhooks
    .verifyAndReceive({
      id: request.headers.get('x-github-delivery') as string,
      name: request.headers.get('x-github-event') as keyof EventPayloadMap,
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
    | DiscussionLabeledEvent
    | DiscussionLabeledEvent
    | DiscussionUnlabeledEvent
    | DiscussionCategoryChangedEvent
    | DiscussionEditedEvent
    | DiscussionDeletedEvent

  if (!data.discussion) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      message: 'Not a discussion event',
    })
  }

  const postSlug = data.discussion.title
  const categorySlug = data.discussion.category.slug

  if (data.action === 'category_changed') {
    revalidateTag('posts')
    revalidateTag(postSlug)
  }

  if (!isAllowedCategory(categorySlug)) {
    return NextResponse.json({
      revalidated: false,
      now: Date.now(),
      message: `It doesn't matter if posts in the category ${categorySlug} are created, edited, deleted, labeled or unlabeled.`,
    })
  }

  if (data.action === 'deleted') {
    revalidateTag('posts')
    revalidateTag('tags')
    revalidateTag(postSlug)
  }

  if (data.action === 'created') {
    revalidateTag('posts')
    revalidateTag('tags')
  }

  if (data.action === 'edited') {
    revalidateTag('posts')
    revalidateTag(postSlug)
  }

  if (data.action === 'labeled') {
    revalidateTag('posts')
    revalidateTag('tags')
    revalidateTag(postSlug)
  }

  if (data.action === 'unlabeled') {
    revalidateTag('posts')
    revalidateTag('tags')
    revalidateTag(postSlug)
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    message: 'Revalidated tags',
  })
}
