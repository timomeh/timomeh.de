import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'
import { cacheAllPages } from '@/data/pages'
import { cacheAllPostsAndTags, listPublishedPosts } from '@/data/posts'
import { updateSettingsCache } from '@/data/settings'
import { log as baseLog } from '@/lib/log'

const log = baseLog.child().withContext({ module: 'webhooks/nuke' })

// yeet everything that's in the cache and re-cache it.

export async function GET(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.searchParams.get('secret') !== config.api.nukeSecret
  ) {
    return NextResponse.json({ message: 'Unverified' }, { status: 401 })
  }

  const soft = request.nextUrl.searchParams.get('soft')

  if (soft) {
    const existingPosts = await listPublishedPosts()
    if (existingPosts.length > 0) {
      log.info(
        'It looks like we have cached data. Not nuking because soft is used',
      )

      revalidateTag('mdx')

      return NextResponse.json({
        revalidated: false,
        now: Date.now(),
      })
    }
  }

  log.info('Nuking all caches...')

  // TODO: this makes lots of requests to the same /git/trees/HEAD?recursive=1 URL
  await cacheAllPages()
  await cacheAllPostsAndTags()
  await updateSettingsCache()
  revalidateTag('feed-pre')
  revalidateTag('mdx')
  revalidatePath('/tags')
  revalidatePath('/posts/[slug]', 'page')
  revalidatePath('/[page]', 'page')

  log.info('Successfully nuked all caches')

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  })
}
