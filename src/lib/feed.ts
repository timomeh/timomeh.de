import { Feed, FeedOptions } from 'feed'
import { unstable_cache } from 'next/cache'
import removeMd from 'remove-markdown'

import { listPosts } from './blog'

type FeedType = 'atom' | 'json' | 'rss'

export const buildPostsFeed = unstable_cache(
  async (type: FeedType) => {
    const posts = await listPosts()
    const updated = new Date(
      Math.max(...posts.map((post) => post.updatedAt.getTime())),
    )

    const feed = new Feed({
      ...postsOptions,
      updated,
    })

    posts.forEach((post) => {
      feed.addItem({
        id: `https://timomeh.de/posts/${post.slug}`,
        published: post.postedAt,
        date: post.updatedAt,
        link: `https://timomeh.de/posts/${post.slug}`,
        title: post.safeTitle,
        description: removeMd(post.excerpt || '') || post.description,
        image: `https://timomeh.de/assets/og-image/posts/${post.slug}.png`,
        content: post.bodyHTML
          // remove title
          .replace(/\<h1(.*?)\>(.*?)\<\/h1\>/, '')
          // remove frontmatter
          .replace(
            /\<div class="snippet-clipboard-content notranslate(.*?)"((.|\n)*?)\>((.|\n)*?)<\/div\>/,
            '',
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
          (s) =>
            s + '<?xml-stylesheet href="/pretty-feed.xsl" type="text/xsl"?>',
        )
    }

    if (type === 'json') {
      return feed.json1()
    }

    throw new Error('Not a supported type')
  },
  ['feed'],
  { tags: ['posts'] },
)

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
