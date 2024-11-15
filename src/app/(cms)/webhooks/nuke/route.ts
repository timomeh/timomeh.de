import { NextRequest, NextResponse } from 'next/server'

import { cacheAllPages } from '@/data/pages'
import { cacheAllPosts } from '@/data/posts'
import { cacheAllTags } from '@/data/tags'
import { updateSettingsCache } from '@/data/settings'
import { revalidateTag } from 'next/cache'
import { config } from '@/config'
import { logger } from '@/lib/log'

export const fetchCache = 'default-cache'
const log = logger.child({ module: 'webhooks/nuke' })

export async function GET(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.searchParams.get('secret') !== config.api.nukeSecret
  ) {
    return NextResponse.json({ message: 'Unverified' }, { status: 401 })
  }

  log.info('Nuking all caches...')

  // TODO: this makes lots of requests to the same /git/trees/HEAD?recursive=1 URL
  await cacheAllPages()
  await cacheAllPosts()
  await cacheAllTags()
  await updateSettingsCache()
  revalidateTag('compiled-posts')

  log.info('Successfully nuked all caches')

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  })
}
