import { Metadata } from 'next'

export const body = `
# Want to follow a Feed?

A feed for all posts. Available in rss, atom or json, because why not.

- https://timomeh.de/posts/feed.rss
- https://timomeh.de/posts/feed.atom
- https://timomeh.de/posts/feed.json

Please note that the Feeds might not render everything in the same way as it is
displayed on my site.
`

export const head: Metadata = {
  title: 'Feeds',
}
