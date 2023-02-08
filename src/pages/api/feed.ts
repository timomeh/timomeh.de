import { Feed } from 'feed'
import type { NextApiRequest, NextApiResponse } from 'next'

import { listOfftopics, listPosts, Offtopic } from '@/lib/blog'

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

  const typeQuery = req.query.type?.toString()
  if (!typeQuery || !['posts', 'offtopic'].includes(typeQuery)) {
    res.status(400).send('Invalid type')
    return
  }
  const type = typeQuery as 'posts' | 'offtopic'

  const listEntires = {
    posts: listPosts,
    offtopic: listOfftopics,
  }

  const entries = await listEntires[type]()

  const latestUpdate = new Date(
    Math.max(...entries.map((entry) => entry.updatedAt.getTime()))
  )

  const title = {
    posts: 'Timo’s Posts',
    offtopic: 'Timo’s Stream',
  }

  const description = {
    posts:
      'About software development and other thoughts I wanted to elaborate on.',
    offtopic: 'Collection of random thoughts and things I wanted to share.',
  }

  const feed = new Feed({
    id: `https://timomeh.de/${type}/`,
    link: `https://timomeh.de/${type}/`,
    description: description[type],
    language: 'en',
    favicon: 'https://timomeh.de/favicon.ico',
    title: title[type],
    copyright: '',
    updated: latestUpdate,
    generator: 'timomeh.de',
    feedLinks: {
      rss: `https://timomeh.de/${type}/feed.rss`,
      json: `https://timomeh.de/${type}/feed.json`,
      atom: `https://timomeh.de/${type}/feed.atom`,
    },
    author: {
      name: 'Timo Mämecke',
      link: 'https://timomeh.de',
    },
  })

  entries.forEach((entry) => {
    const title =
      type === 'offtopic' ? (entry as Offtopic).safeTitle : entry.title
    console.log(entry.bodyHTML)
    feed.addItem({
      id: `https://timomeh.de/${type}/${entry.slug}`,
      published: entry.postedAt,
      date: entry.updatedAt,
      link: `https://timomeh.de/${type}/${entry.slug}`,
      title: title || entry.slug,
      image: `https://timomeh.de/assets/og-image/${type}/${entry.slug}.png`,
      content: entry.bodyHTML
        // remove title
        .replace(/\<h1(.*?)\>(.*?)\<\/h1\>/, '')
        // remove frontmatter
        .replace(
          /\<div class="snippet-clipboard-content notranslate(.*?)"((.|\n)*?)\>((.|\n)*?)<\/div\>/,
          ''
        ),
    })
  })

  const byFormat = {
    rss: {
      type: 'text/xml',
      body: () =>
        feed
          .rss2()
          .replace(
            '<?xml version="1.0" encoding="utf-8"?>',
            (s) =>
              s + '<?xml-stylesheet href="/pretty-feed.xsl" type="text/xsl"?>'
          ),
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
    'public, s-maxage=600, stale-while-revalidate=1800' // 10 minute cache, 30 minute swr
  )

  res.write(byFormat[format].body())
  res.end()
}
