import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'
import { log as baseLog } from '@/lib/log'

const log = baseLog.child().withContext({ module: 'webhooks/revalidate' })

// revalidate a cache remotely

export async function GET(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.searchParams.get('secret') !== config.api.nukeSecret
  ) {
    return NextResponse.json({ message: 'Unverified' }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return NextResponse.json({
      revalidated: false,
      message: 'tag=xxx search param is missing',
      now: Date.now(),
    })
  }

  revalidateTag(tag, 'max')
  log.info(`Successfully revalidated ${tag}`)

  return NextResponse.json({
    revalidated: true,
    message: `Revalidated ${tag}`,
    now: Date.now(),
  })
}
