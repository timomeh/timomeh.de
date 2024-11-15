import { Webhooks } from '@octokit/webhooks'
import { EventPayloadMap, PushEvent } from '@octokit/webhooks-types'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { updatePageCache } from '@/data/pages'
import { updatePostCache } from '@/data/posts'
import { updateTagCache } from '@/data/tags'
import { updateSettingsCache } from '@/data/settings'
import { config } from '@/config'

export const fetchCache = 'default-cache'

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks({
    secret: config.github.webhookSecret,
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
    .catch(() => false)

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

  if (event === 'push') {
    const data = JSON.parse(body) as PushEvent

    const allChanges = data.commits
      .map((commit) => [...commit.modified, ...commit.added, ...commit.removed])
      .flat()
    const changedFiles = Array.from(new Set(allChanges))

    await Promise.allSettled(
      changedFiles.map(async (file) => {
        const [resource, slug] = file.split('/')

        if (resource === 'posts') {
          await updatePostCache(slug)
          revalidateTag(`compiled-post/${slug}`)
        }

        if (resource === 'pages') {
          await updatePageCache(slug)
        }

        if (resource === 'tags') {
          await updateTagCache(slug)
        }

        if (resource === 'settings') {
          await updateSettingsCache()
        }
      }),
    )

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
