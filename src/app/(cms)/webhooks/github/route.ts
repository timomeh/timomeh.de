import { Webhooks } from '@octokit/webhooks'
import type { EventPayloadMap, PushEvent } from '@octokit/webhooks-types'
import { type NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'
import { kernel } from '@/data/kernel'
import { log as baseLog } from '@/lib/log'
import { UpdateChangedFiles } from '../data'

const log = baseLog.child().withContext({ module: 'webhooks/github' })

// cache content changes

export async function POST(request: NextRequest) {
  const webhooks = new Webhooks({
    secret: config.github.webhookSecret,
  })

  const body = await request.text()

  webhooks.onError((error) => {
    log.withError(error).error('Failed to process webhook')
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

    const allModified = data.commits.flatMap((commit) => commit.modified)
    const allAdded = data.commits.flatMap((commit) => commit.added)
    const allRemoved = data.commits.flatMap((commit) => commit.removed)

    const changedFiles = Array.from(
      new Set([...allModified, ...allAdded, ...allRemoved]),
    )

    await UpdateChangedFiles.withKernel(kernel.scoped()).invoke(changedFiles)

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
