import { buildPostsFeed } from '@/lib/feed'

export async function GET() {
  const feed = await buildPostsFeed('json')

  return new Response(feed, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  })
}
