import { NextSeoProps } from 'next-seo'

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
`

export const head: NextSeoProps = {
  title: 'Feeds',
}
