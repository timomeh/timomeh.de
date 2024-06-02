import { Feed, FeedOptions } from 'feed'
import removeMd from 'remove-markdown'
import { PostDto, getPostBySlug, listPosts } from '@/app/_data/post.dto'

type FeedType = 'atom' | 'json' | 'rss'

export async function buildFeed(type: FeedType) {
  const slugs = await listPosts(undefined)
  const tryPosts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  const posts = tryPosts.filter((post): post is PostDto => !!post)

  const updated = new Date(
    Math.max(...posts.map((post) => new Date(post.updatedAt).getTime())),
  )

  const feed = new Feed({
    ...postsOptions,
    updated,
  })

  posts.forEach((post) => {
    feed.addItem({
      id: `https://timomeh.de/posts/${post.slug}`,
      published: new Date(post.publishedAt || Date.now()),
      date: new Date(post.updatedAt),
      link: `https://timomeh.de/posts/${post.slug}`,
      title: post.title,
      description: post.meta.description || removeMd(post.excerpt || ''),
      content: post.body,
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
