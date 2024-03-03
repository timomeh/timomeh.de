import { buildPostsFeed } from '@/lib/feed'

export async function GET() {
  const feed = await buildPostsFeed('atom')

  return new Response(feed, {
    headers: {
      'content-type': 'application/atom+xml; charset=utf-8',
    },
  })
}
