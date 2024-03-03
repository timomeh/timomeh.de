import { buildPostsFeed } from '@/lib/feed'

export async function GET() {
  const feed = await buildPostsFeed('rss')

  return new Response(feed, {
    headers: {
      'content-type': 'text/xml; charset=utf-8',
    },
  })
}
