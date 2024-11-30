import { Webhooks } from '@octokit/webhooks'
import { EventPayloadMap, PushEvent } from '@octokit/webhooks-types'
import { unstable_expireTag as expireTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { updatePageCache } from '@/data/pages'
import { updatePostCache } from '@/data/posts'
import { updateTagCache } from '@/data/tags'
import { updateSettingsCache } from '@/data/settings'
import { config } from '@/config'
import { logger } from '@/lib/log'

const log = logger.child({ module: 'webhooks/github' })

// cache content changes

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks({
    secret: config.github.webhookSecret,
  })

  const body = await request.text()

  webhooks.onError((error) => {
    log.error(error, 'Failed to process webhook')
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

    const allModified = data.commits.map((commit) => commit.modified).flat()
    const allAdded = data.commits.map((commit) => commit.added).flat()
    const allRemoved = data.commits.map((commit) => commit.removed).flat()

    const changedFiles = Array.from(
      new Set([...allModified, ...allAdded, ...allRemoved]),
    )
    const addedOrRemovedFiles = Array.from(
      new Set([...allAdded, ...allRemoved]),
    )

    // update individuals
    await Promise.allSettled(
      changedFiles.map(async (file) => {
        const [resource, slug] = file.split('/')

        if (resource === 'posts') {
          await updatePostCache(slug)
          expireTag(`post:${slug}`)
          log.info({ resource, slug }, 'Updated cache')
          return
        }

        if (resource === 'pages') {
          await updatePageCache(slug)
          expireTag(`page:${slug}`)
          log.info({ resource, slug }, 'Updated cache')
          return
        }

        if (resource === 'tags') {
          await updateTagCache(slug)
          expireTag(`tags:${slug}`)
          log.info({ resource, slug }, 'Updated cache')
          return
        }

        if (resource === 'settings') {
          await updateSettingsCache()
          log.info({ resource, slug }, 'Updated cache')
          return
        }

        log.debug(`Nothing to update for ${file}`)
      }),
    )

    // update lists
    for (const file of addedOrRemovedFiles) {
      const [resource] = file.split('/')
      if (resource === 'posts') {
        expireTag('posts-list')
      }

      if (resource === 'tags') {
        expireTag('tags-list')
      }
    }

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
