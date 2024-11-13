import { Feed, FeedOptions } from 'feed'
import { listPublishedPosts } from '@/data/posts'
import { unstable_cache } from 'next/cache'

type FeedType = 'atom' | 'json' | 'rss'

export async function buildFeed(type: FeedType) {
  const posts = await listPublishedPosts()

  const updated = new Date(
    Math.max(
      ...posts.map((post) =>
        post.updatedAt ? new Date(post.updatedAt).getTime() : 0,
      ),
    ),
  )

  const feed = new Feed({
    ...postsOptions,
    updated,
  })

  const compiledPosts = await Promise.all(
    posts.map(async (post) => {
      const cachedContentFn = unstable_cache(
        async () => {
          const headers = new Headers()
          headers.set('x-api-key', process.env.INTERNAL_SECRET!)
          const res = await fetch(
            `http://localhost:3000/partials/posts/${post.slug}`,
            { headers },
          )
          const html = await res.text()

          // Use regular expression to find the <article id="partial">...</article> content
          const match = html.match(
            /<article id="partial">([\s\S]*?)<\/article>/,
          )

          // Extract and return only the content within the <article> tag
          const articleContent = match?.[1]
          return articleContent
        },
        [`compiled-post/${post.slug}`],
        { tags: ['compiled-posts', `compiled-post/${post.slug}`] },
      )

      const contentAsHtml = await cachedContentFn()
      return contentAsHtml
    }),
  )

  posts.forEach((post, i) => {
    feed.addItem({
      id: `https://timomeh.de/posts/${post.slug}`,
      published: new Date(post.publishedAt),
      date: post.updatedAt
        ? new Date(post.updatedAt)
        : new Date(post.publishedAt),
      link: `https://timomeh.de/posts/${post.slug}`,
      title: post.title,
      content: compiledPosts[i],
    })
  })

  if (type === 'atom') {
    return feed.atom1()
  }

  if (type === 'rss') {
    return feed
      .rss2()
      .replace(
        '<?xml version="1.0" encoding="utf-8"?>',
        (s) => s + '<?xml-stylesheet href="/pretty-feed.xsl" type="text/xsl"?>',
      )
  }

  if (type === 'json') {
    return feed.json1()
  }

  throw new Error('Not a supported type')
}

const postsOptions: FeedOptions = {
  id: `https://timomeh.de`,
  link: `https://timomeh.de`,
  description:
    'About software development and other thoughts I wanted to elaborate on.',
  language: 'en',
  favicon: 'https://timomeh.de/favicon.ico',
  title: 'timomeh.de',
  copyright: '',
  generator: 'timomeh.de',
  feedLinks: {
    rss: `https://timomeh.de/posts/feed.rss`,
    json: `https://timomeh.de/posts/feed.json`,
    atom: `https://timomeh.de/posts/feed.atom`,
  },
  author: {
    name: 'Timo Mämecke',
    link: 'https://timomeh.de',
  },
}
