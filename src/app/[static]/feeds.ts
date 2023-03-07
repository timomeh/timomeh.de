import { Metadata } from 'next'

export const body = `
# Want to follow a Feed?

You can follow the feeds for my two categories *Stream* and *Posts* separately.
Maybe one day I'll add a combined feed. They're available in rss, atom or json,
because why not.

## Stream
- https://timomeh.de/offtopic/feed.rss
- https://timomeh.de/offtopic/feed.atom
- https://timomeh.de/offtopic/feed.json

## Posts
- https://timomeh.de/posts/feed.rss
- https://timomeh.de/posts/feed.atom
- https://timomeh.de/posts/feed.json

Please note that the Feeds might not render everything in the same way as it is
displayed on my site.
`

export const head: Metadata = {
  title: 'Feeds',
  openGraph: {
    images: [
      {
        url: 'https://timomeh.de/assets/og-image/static/feeds.png',
        height: 630,
        width: 1200,
      },
    ],
  },
}
