import { buildFeed } from '@/lib/feed'

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

  const feed = await buildFeed(params.type)

  return new Response(feed, {
    headers: {
      'content-type': contentTypes[params.type],
      'Cache-Control': 'public, s-maxage=1',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}

const contentTypes = {
  atom: 'application/atom+xml; charset=utf-8',
  json: 'application/json; charset=utf-8',
  rss: 'text/xml; charset=utf-8',
}
