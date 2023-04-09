import { buildPostsFeed } from '@/lib/feed'

export async function GET() {
  const feed = await buildPostsFeed()

  return new Response(feed.atom1(), {
    headers: {
      'content-type': 'application/atom+xml; charset=utf-8',
      'cache-control': 'public, s-maxage=600, stale-while-revalidate=1800', // 10 minute cache, 30 minute swr
    },
  })
}
