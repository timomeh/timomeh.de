import { Feed, FeedOptions } from 'feed'
import removeMd from 'remove-markdown'

import { getPost, listPosts, Post } from './blog'
import { unstable_cache } from 'next/cache'

type FeedType = 'atom' | 'json' | 'rss'

const fetchAllPosts = unstable_cache(
  async () => {
    const slugs = await listPosts()
    const tryPosts = await Promise.all(slugs.map((slug) => getPost(slug)))
    const posts = tryPosts.filter((post): post is Post => !!post)
    return posts
  },
  ['fetchAllPosts/feeds'],
  { tags: ['github-raw'] },
)

export async function buildFeed(type: FeedType) {
  const posts = await fetchAllPosts()

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
      published: new Date(post.postedAt),
      date: new Date(post.updatedAt),
      link: `https://timomeh.de/posts/${post.slug}`,
      title: post.safeTitle,
      description: removeMd(post.excerpt || '') || post.description,
      content: post.bodyHTML
        // remove title
        .replace(/\<h1(.*?)\>(.*?)\<\/h1\>/, '')
        // remove frontmatter
        .replace(
          /\<div class="snippet-clipboard-content notranslate(.*?)"((.|\n)*?)\>((.|\n)*?)<\/div\>/,
          '',
        )
        // Change github's private asset urls to public ones
        .replace(
          /(https:\/\/private-user-images\.githubusercontent\.com\/(\d+)\/)(\w+)-((\w+-)+\w+)\.\w+(\?.*?)?(")/g,
          'https://github.com/timomeh/timomeh.de/assets/$2/$4$7',
        ),
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
