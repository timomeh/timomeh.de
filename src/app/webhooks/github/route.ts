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

import { labelNameToSlug } from '@/lib/blog'
import { fetchDiscussion, isAllowedCategory, isTag } from '@/lib/github'

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
    // Creating a label has no effect on the blog.
    // Only if a discussion gets labeled.
  }

  if (data.action === 'deleted' && isTag(data.label.name)) {
    // When a label-tag was deleted, the list of labels has changed
    revalidateTag('github/labels')
  }

  if (data.action === 'edited') {
    if (data.changes?.name?.from && isTag(data.changes.name.from)) {
      // When the name of a label-tag changed, the list of labels has changed
      revalidateTag('github/labels')
    }

    if (isTag(data.label.name)) {
      // The label-tag has changed
      revalidateTag(`github/label/${labelNameToSlug(data.label.name)}`)
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
    // Ignore events without any affects: when a label was moved between public
    // categories or between unlisted categories. I do not differentiate between
    // them right now.
    const staysPublic =
      isAllowedCategory(data.discussion.category.slug) &&
      isAllowedCategory(data.changes.category.from.slug)
    const staysUnlisted =
      !isAllowedCategory(data.discussion.category.slug) &&
      !isAllowedCategory(data.changes.category.from.slug)

    if (staysPublic || staysUnlisted) {
      return
    }
  }

  if (data.action === 'category_changed') {
    // When a discussion changed between public and private, the list of all
    // discussions is affected, as well as the labeled lists.
    const discussion = await fetchDiscussion(data.discussion.title)
    discussion?.labels?.nodes?.forEach((label) => {
      if (label) revalidateTag(`github/discussions/labeled:${label.name}`)
    })
    revalidateTag('github/discussions/all')
    revalidateTag(`github/discussion/${data.discussion.title}`)

    // A new/removed post can affect the order of labels
    revalidateTag('github/labels')
  }

  if (data.action === 'created') {
    if (!isAllowedCategory(data.discussion.category.slug)) return

    // When a discussion is created, the list of all discussions is affected,
    // as well as the labeled lists.
    const discussion = await fetchDiscussion(data.discussion.title)
    discussion?.labels?.nodes?.forEach((label) => {
      if (label) revalidateTag(`github/discussions/labeled:${label.name}`)
    })
    revalidateTag('github/discussions/all')

    // A new post can affect the order of labels
    revalidateTag('github/labels')
  }

  if (data.action === 'deleted') {
    if (!isAllowedCategory(data.discussion.category.slug)) return

    // When a discussion is deleted, the list of all discussions is affected,
    // as well as the labeled lists.
    const discussion = await fetchDiscussion(data.discussion.title)
    discussion?.labels?.nodes?.forEach((label) => {
      if (label) revalidateTag(`github/discussions/labeled:${label.name}`)
    })
    revalidateTag('github/discussions/all')
    revalidateTag(`github/discussion/${data.discussion.title}`)

    // A removed post can affect the order of labels
    revalidateTag('github/labels')
  }

  if (data.action === 'edited') {
    if (!isAllowedCategory(data.discussion.category.slug)) return

    if (data.changes?.title) {
      // When the title changed, the slugs has changed, which affects
      // the list of all discussions, as well as the labeled lists.
      const discussion = await fetchDiscussion(data.discussion.title)
      discussion?.labels?.nodes?.forEach((label) => {
        if (label) revalidateTag(`github/discussions/labeled:${label.name}`)
      })
      revalidateTag('github/discussions/all')
    }

    revalidateTag(`github/discussion/${data.discussion.title}`)
  }

  if (data.action === 'labeled') {
    if (!isAllowedCategory(data.discussion.category.slug)) return

    // When a discussion is labeled, it affects the list labeled list, as well
    // as of course the dicussion itself.
    revalidateTag(`github/discussions/labeled:${data.label.name}`)
    revalidateTag(`github/discussion/${data.discussion.title}`)

    // Adding a label to a post can affect the order of labels
    revalidateTag('github/labels')
  }

  if (data.action === 'unlabeled') {
    if (!isAllowedCategory(data.discussion.category.slug)) return

    // When a discussion is unlabeled, it affects the list labeled list, as well
    // as of course the dicussion itself.
    revalidateTag(`github/discussions/labeled:${data.label.name}`)
    revalidateTag(`post/slug:${data.discussion.title}`)

    // Removing a label from a post can affect the order of labels
    revalidateTag('github/labels')
  }
}
