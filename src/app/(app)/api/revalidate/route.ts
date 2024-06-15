import { categoryCacheKey } from '@/app/_data/category.dto'
import { pageCacheKey } from '@/app/_data/page.dto'
import { postCacheKey } from '@/app/_data/post.dto'
import { env } from '@/env'
import { cms } from '@/payload/client'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export type RevalidateAction =
  | 'list:posts'
  | 'list:pages'
  | 'list:categories'
  | `post:${string}`
  | `page:${string}`
  | `category:${string}`
  | `category-post:${string}`

export async function GET(req: NextRequest) {
  const verified = verify(req.headers.get('x-secret'))
  if (!verified) {
    cms.logger.warn('Called revalidate without secret')
    return NextResponse.json(
      {
        revalidated: false,
        now: Date.now(),
        message: 'Unverified',
      },
      { status: 401 },
    )
  }

  const action = req.nextUrl.searchParams.get('action') as RevalidateAction
  if (!action) {
    cms.logger.warn('Called revalidate without action')
    return NextResponse.json(
      {
        revalidated: false,
        now: Date.now(),
        message: 'No action',
      },
      { status: 401 },
    )
  }

  if (action === 'list:categories') {
    revalidate(categoryCacheKey.list.invalidate())
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  if (action.startsWith('category:')) {
    const slug = action.replace('category:', '')
    revalidate(categoryCacheKey.single.invalidate(slug))
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  if (action.startsWith('category-post:')) {
    // When a category changed its slug or got deleted, we gotta invalidate
    // all posts because I made a nasty shortcut where I'm nesting category
    // slugs inside the post DTO, which is cached, and I don't have a cache key
    // for posts with this old slug.
    // will fix maybe some day
    revalidate(postCacheKey.single.invalidateAll())

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  if (action === 'list:posts') {
    revalidate(postCacheKey.list.invalidate())
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  if (action.startsWith('post:')) {
    const slug = action.replace('post:', '')
    revalidate(postCacheKey.single.invalidate(slug))
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  if (action === 'list:pages') {
    revalidate(pageCacheKey.list.invalidate())
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  if (action.startsWith('page:')) {
    const slug = action.replace('page:', '')
    revalidate(pageCacheKey.single.invalidate(slug))
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Revalidated ${action}`,
    })
  }

  cms.logger.warn(`Called unknown action "${action}"`)
  return NextResponse.json(
    {
      revalidated: false,
      now: Date.now(),
      message: `Called unknown action "${action}"`,
    },
    { status: 400 },
  )
}

function verify(secret?: string | null) {
  if (!secret) return false
  if (secret !== env.PAYLOAD_NEXT_BRIDGE_SECRET) return false
  return true
}

function revalidate(tag: string) {
  cms.logger.info(`Revalidate tag: ${tag}`)
  revalidateTag(tag)
}
