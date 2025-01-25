import { Feed, FeedOptions } from 'feed'
import { unstable_cache } from 'next/cache'

import { config } from '@/config'
import { listPublishedPosts } from '@/data/posts'

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
      const fetchRenderedHtml = unstable_cache(
        async (slug: string) => {
          const headers = new Headers()
          headers.set('x-api-key', config.api.internalSecret)
          const res = await fetch(
            `http://localhost:3000/partials/posts/${slug}`,
            {
              headers,
            },
          )
          const html = await res.text()

          // Extract the content from between <marker-begin> and <marker-end>
          const match = html.match(
            /<marker-begin><\/marker-begin>([\s\S]*?)<marker-end><\/marker-end>/,
          )

          // Extract and return only the content within the <article> tag
          const articleContent = match?.[1]?.trim()
          return articleContent
        },
        ['feed-prerendered-html'],
        { tags: ['feed-pre', `feed-pre:${post.slug}`] },
      )

      return fetchRenderedHtml(post.slug)
    }),
  )

  posts.forEach((post, i) => {
    feed.addItem({
      id: `${config.siteUrl}/posts/${post.slug}`,
      published: new Date(post.publishedAt),
      date: post.updatedAt
        ? new Date(post.updatedAt)
        : new Date(post.publishedAt),
      link: `${config.siteUrl}/posts/${post.slug}`,
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
  id: config.siteUrl,
  link: config.siteUrl,
  description:
    'About software development and other thoughts I wanted to elaborate on.',
  language: 'en',
  favicon: `${config.siteUrl}/favicon.ico`,
  title: 'timomeh.de',
  copyright: '',
  generator: 'timomeh.de',
  feedLinks: {
    rss: `${config.siteUrl}/posts/feed.rss`,
    json: `${config.siteUrl}/posts/feed.json`,
    atom: `${config.siteUrl}/posts/feed.atom`,
  },
  author: {
    name: 'Timo Mämecke',
    link: 'https://timomeh.de',
  },
}
