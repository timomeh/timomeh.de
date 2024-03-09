import { buildPostsFeed } from '@/lib/feed'

type Options = {
  params: {
    type: string
  }
}

export async function GET(_req: Request, { params }: Options) {
  if (
    params.type !== 'atom' &&
    params.type !== 'rss' &&
    params.type !== 'json'
  ) {
    return new Response('Not an allowed feed type', { status: 400 })
  }

  const feed = await buildPostsFeed(params.type)

  return new Response(feed, {
    headers: {
      'content-type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1',
      'CDN-Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
      'Vercel-CDN-Cache-Control':
        'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
