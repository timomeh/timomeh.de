import { buildPostsFeed } from '@/lib/feed'

export async function GET() {
  const feed = await buildPostsFeed()

  return new Response(
    feed
      .rss2()
      .replace(
        '<?xml version="1.0" encoding="utf-8"?>',
        (s) => s + '<?xml-stylesheet href="/pretty-feed.xsl" type="text/xsl"?>',
      ),
    {
      headers: {
        'content-type': 'text/xml; charset=utf-8',
        'cache-control': 'public, s-maxage=600, stale-while-revalidate=1800', // 10 minute cache, 30 minute swr
      },
    },
  )
}
