import { NextRequest, NextResponse } from 'next/server'

import { cacheAllPages } from '@/data/pages'
import { cacheAllPosts } from '@/data/posts'
import { cacheAllTags } from '@/data/tags'
import { updateSettingsCache } from '@/data/settings'
import { revalidateTag } from 'next/cache'
import { config } from '@/config'

export const fetchCache = 'default-cache'

export async function GET(request: NextRequest) {
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.searchParams.get('secret') !== config.api.nukeSecret
  ) {
    return NextResponse.json({ message: 'Unverified' }, { status: 401 })
  }

  // TODO: this makes lots of requests to the same /git/trees/HEAD?recursive=1 URL
  await cacheAllPages()
  await cacheAllPosts()
  await cacheAllTags()
  await updateSettingsCache()
  revalidateTag('compiled-posts')

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  })
}
