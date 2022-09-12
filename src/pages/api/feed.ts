import type { NextApiRequest, NextApiResponse } from 'next'
import { Feed } from 'feed'
import { getFeedPosts } from '../../lib/blog'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const formatQuery = req.query.format?.toString() || 'rss'
  if (!['rss', 'atom', 'json'].includes(formatQuery)) {
    res.status(400).send('Invalid format')
    return
  }
  const format = formatQuery as 'rss' | 'atom' | 'json'

  const posts = await getFeedPosts()
  const latestUpdate = new Date(
    Math.max(...posts.map((post) => post.updatedAt.getTime()))
  )

  const feed = new Feed({
    id: 'https://timomeh.de/posts/',
    link: 'https://timomeh.de/posts/',
    description:
      'Collection of things and thoughts I felt like writing about. A mixture of software development, JavaScript, React, or just random stuff.',
    language: 'en',
    favicon: 'https://timomeh.de/favicon.ico',
    title: 'Timo’s Posts',
    copyright: '',
    updated: latestUpdate,
    generator: 'timomeh.de',
    feedLinks: {
      rss: 'https://timomeh.de/posts/feed.rss',
      json: 'https://timomeh.de/posts/feed.json',
      atom: 'https://timomeh.de/posts/feed.atom',
    },
    author: {
      name: 'Timo Mämecke',
      link: 'https://timomeh.de',
    },
  })

  posts.forEach((post) => {
    feed.addItem({
      id: `https://timomeh.de/posts/${post.slug}`,
      published: post.postedAt,
      date: post.updatedAt,
      link: `https://timomeh.de/posts/${post.slug}`,
      title: post.title,
      image: `https://timomeh.de/assets/og-image/posts/${post.slug}.png`,
      content: post.body,
    })
  })

  const byFormat = {
    rss: {
      type: 'text/xml',
      body: () => feed.rss2(),
    },
    atom: {
      type: 'application/atom+xml',
      body: () => feed.atom1(),
    },
    json: {
      type: 'application/json',
      body: () => feed.json1(),
    },
  }

  res.setHeader('Content-Type', byFormat[format].type.concat('; charset=utf-8'))
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=1800' // 2 minute cache, 30 minute swr
  )

  res.write(byFormat[format].body())
  res.end()
}
