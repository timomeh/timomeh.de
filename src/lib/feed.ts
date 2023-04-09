import { Feed, FeedOptions } from 'feed'
import { listOfftopics, listPosts } from './blog'
import removeMd from 'remove-markdown'

export async function buildPostsFeed() {
  const posts = await listPosts()
  const updated = new Date(
    Math.max(...posts.map((post) => post.updatedAt.getTime()))
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
          ''
        ),
    })
  })

  return feed
}

export async function buildOfftopicsFeed() {
  const offtopics = await listOfftopics()
  const updated = new Date(
    Math.max(...offtopics.map((offtopic) => offtopic.updatedAt.getTime()))
  )

  const feed = new Feed({
    ...offtopicOptions,
    updated,
  })

  offtopics.forEach((post) => {
    feed.addItem({
      id: `https://timomeh.de/offtopic/${post.slug}`,
      published: post.postedAt,
      date: post.updatedAt,
      link: `https://timomeh.de/offtopic/${post.slug}`,
      title: post.safeTitle,
      description: removeMd(post.excerpt || '') || post.description,
      image: `https://timomeh.de/assets/og-image/offtopic/${post.slug}.png`,
      content: post.bodyHTML
        // remove title
        .replace(/\<h1(.*?)\>(.*?)\<\/h1\>/, '')
        // remove frontmatter
        .replace(
          /\<div class="snippet-clipboard-content notranslate(.*?)"((.|\n)*?)\>((.|\n)*?)<\/div\>/,
          ''
        ),
    })
  })

  return feed
}

const postsOptions: FeedOptions = {
  id: `https://timomeh.de/posts/`,
  link: `https://timomeh.de/posts/`,
  description:
    'About software development and other thoughts I wanted to elaborate on.',
  language: 'en',
  favicon: 'https://timomeh.de/favicon.ico',
  title: 'Timo’s Posts',
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

const offtopicOptions: FeedOptions = {
  id: `https://timomeh.de/offtopic/`,
  link: `https://timomeh.de/offtopic/`,
  description: 'Collection of random thoughts and things I wanted to share.',
  language: 'en',
  favicon: 'https://timomeh.de/favicon.ico',
  title: 'Timo’s Stream',
  copyright: '',
  generator: 'timomeh.de',
  feedLinks: {
    rss: `https://timomeh.de/offtopic/feed.rss`,
    json: `https://timomeh.de/offtopic/feed.json`,
    atom: `https://timomeh.de/offtopic/feed.atom`,
  },
  author: {
    name: 'Timo Mämecke',
    link: 'https://timomeh.de',
  },
}
