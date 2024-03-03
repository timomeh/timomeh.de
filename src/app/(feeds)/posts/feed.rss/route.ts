import { unstable_noStore } from 'next/cache'

import { buildPostsFeed } from '@/lib/feed'

export async function GET() {
  unstable_noStore()
  const feed = await buildPostsFeed('rss')

  return new Response(feed, {
    headers: {
      'content-type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=600',
      'CDN-Cache-Control': 'public, s-maxage=600',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=600',
    },
  })
}
