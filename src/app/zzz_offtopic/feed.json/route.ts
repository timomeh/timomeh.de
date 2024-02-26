import { buildOfftopicsFeed } from '@/lib/feed'

export async function GET() {
  const feed = await buildOfftopicsFeed()

  return new Response(feed.json1(), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=600, stale-while-revalidate=1800', // 10 minute cache, 30 minute swr
    },
  })
}
