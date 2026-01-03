import { Feed, type FeedOptions } from 'feed'
import { memoize } from 'nextjs-better-unstable-cache'
import { Vla } from 'vla'
import { config } from '@/config'
import { PostsRepo } from '@/data/posts/posts.repo'
import { ShortsRepo } from '@/data/shorts/shorts.repo'

export class BuildPostsFeed extends Vla.Action {
  postsRepo = this.inject(PostsRepo)

  async handle(type: 'rss' | 'atom' | 'json') {
    const posts = await this.postsRepo.listPublished()

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
                cache: 'no-store',
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
}

export class BuildShortsFeed extends Vla.Action {
  shortsRepo = this.inject(ShortsRepo)

  async handle(type: 'rss' | 'atom' | 'json') {
    const shorts = await this.shortsRepo.list()

    const updated = shorts[0]?.publishedAt

    const feed = new Feed({
      ...shortsOptions,
      updated,
    })

    const compiledShorts = await Promise.all(
      shorts.map(async (short) => {
        const fetchRenderedHtml = memoize(
          async (id: string) => {
            const headers = new Headers()
            headers.set('x-api-key', config.api.internalSecret)
            const res = await fetch(
              `${config.internalUrl}/partials/shorts/${id}`,
              {
                headers,
                cache: 'no-store',
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
            additionalCacheKey: ['feed-prerendered-short-html'],
            revalidateTags: (id) => ['feed-pre', `feed-pre:short-${id}`],
          },
        )

        return fetchRenderedHtml(short.id)
      }),
    )

    shorts.forEach((short, i) => {
      feed.addItem({
        id: `${config.siteUrl}/shorts/${short.id}`,
        published: short.publishedAt,
        date: short.publishedAt,
        link: `${config.siteUrl}/shorts/${short.id}?utm_source=rss`,
        title: short.publishedAt.toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZoneName: 'short',
        }),
        content: compiledShorts[i],
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

const shortsOptions: FeedOptions = {
  id: `${config.siteUrl}/shorts`,
  link: `${config.siteUrl}/shorts`,
  description:
    'Timo’s own social media feed. A stream of thoughts and other shitposts.',
  language: 'en',
  favicon: `${config.siteUrl}/favicon.ico`,
  title: 'timomeh.de Shorts',
  copyright: '',
  generator: 'timomeh.de',
  feedLinks: {
    rss: `${config.siteUrl}/shorts/feed.rss`,
    json: `${config.siteUrl}/shorts/feed.json`,
    atom: `${config.siteUrl}/shorts/feed.atom`,
  },
  author: {
    name: 'Timo Mämecke',
    link: 'https://timomeh.de',
  },
}
