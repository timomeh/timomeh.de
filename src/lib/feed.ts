import { Feed, FeedOptions } from 'feed'
import { memoize } from 'nextjs-better-unstable-cache'

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
      const fetchRenderedHtml = memoize(
        async (slug: string) => {
          const headers = new Headers()
          headers.set('x-api-key', config.api.internalSecret)
          const res = await fetch(
            `${config.internalUrl}/partials/posts/${slug}`,
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
        {
          additionalCacheKey: ['feed-prerendered-html'],
          revalidateTags: (slug) => ['feed-pre', `feed-pre:${slug}`],
        },
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
      link: `${config.siteUrl}/posts/${post.slug}?utm_source=rss`,
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
        (s) =>
          s +
          '<?xml-stylesheet href="/vendor/pretty-feed.xsl" type="text/xsl"?>',
      )
  }

  if (type === 'json') {
    return feed.json1()
  }

  const error = new Error(`Not a supported feed type: ${type}`)
  throw error
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
