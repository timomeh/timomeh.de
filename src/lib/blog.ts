import { cache } from 'react'
import matter from 'gray-matter'
import removeMd from 'remove-markdown'

import { Discussion, getDiscussion, listDiscussions } from './github'

export const listPostsPaginated = cache(async (page = 1) => {
  const limit = 10
  const start = (page - 1) * limit
  const end = start + limit

  const allPosts = await listPosts()
  const posts = allPosts.slice(start, end)
  const prev = page > 1 ? page - 1 : undefined
  const next = allPosts.length > end ? page + 1 : undefined
  const pages = Math.ceil(allPosts.length / limit)

  return { posts, next, prev, pages }
})

export const listPosts = cache(async () => {
  const discussions = await listDiscussions({ category: 'posts' })
  return discussions.map((discussion) => toPost(discussion))
})

export const getPost = cache(async (slug: string) => {
  const discussion = await getDiscussion({ slug, category: 'posts' })
  return discussion && toPost(discussion)
})

export const listOfftopics = cache(async () => {
  const discussions = await listDiscussions({ category: 'offtopic' })
  return discussions.map((discussion) => toOfftopic(discussion))
})

export const listOfftopicsPaginated = cache(async (page = 1) => {
  const limit = 10
  const start = (page - 1) * limit
  const end = start + limit

  const allOfftopics = await listOfftopics()
  const offtopics = allOfftopics.slice(start, end)
  const prev = page > 1 ? page - 1 : undefined
  const next = allOfftopics.length > end ? page + 1 : undefined
  const pages = Math.ceil(allOfftopics.length / limit)

  return { offtopics, next, prev, pages }
})

export const getOfftopic = cache(async (slug: string) => {
  const discussion = await getDiscussion({ slug, category: 'offtopic' })
  if (process.env.NODE_ENV === 'development' && !discussion) {
    const draft = await getDiscussion({ slug, category: 'drafts' })
    return draft && toOfftopic(draft)
  }

  return discussion && toOfftopic(discussion)
})

function toPost(discussion: Discussion) {
  const { excerpt, meta, title, body } = parseDocument(discussion.body, true)

  return {
    slug: discussion.title,
    number: discussion.number,
    postedAt: new Date(discussion.createdAt),
    updatedAt: new Date(discussion.updatedAt),
    title: title || discussion.title,
    safeTitle: removeMd(title || discussion.title),
    meta,
    excerpt,
    body,
    bodyHTML: discussion.bodyHTML,
  }
}

export type Post = ReturnType<typeof toPost>

function toOfftopic(discussion: Discussion) {
  const { excerpt, meta, title, body } = parseDocument(discussion.body)

  return {
    slug: discussion.title,
    number: discussion.number,
    postedAt: new Date(discussion.createdAt),
    updatedAt: new Date(discussion.updatedAt),
    title,
    safeTitle: removeMd(
      meta.title ||
        title ||
        body.split(' ').slice(0, 10).join(' ').concat('…') ||
        discussion.title
    ),
    meta,
    excerpt,
    body,
    bodyHTML: discussion.bodyHTML,
  }
}

export type Offtopic = ReturnType<typeof toOfftopic>

type MetaData = {
  description?: string
  toc?: boolean
  lang?: string
  og_image?: string
  cover_image?: string
  title?: string
}

function parseDocument(document: string, fakeExcerpt = false) {
  const excerptSeparator = '<!-- intro -->'
  const parsed = matter(document, {
    excerpt: true,
    excerpt_separator: excerptSeparator,
    delimiters: '~~~',
  })

  const title = /^# (.*$)/gim.exec(document)?.[1].trim()
  const content = parsed.content.split(excerptSeparator).at(-1) || ''
  const body = content.replace(/^# .*$/gim, '')
  // TODO delete fallback excerpt when I migrated all the posts to use excerpts
  const excerpt = fakeExcerpt
    ? parsed.excerpt?.replace(/^# (.*$)/gim, '') ||
      body.split('\r\n').filter(Boolean)[0]
    : parsed.excerpt?.replace(/^# (.*$)/gim, '')

  return {
    excerpt,
    meta: parsed.data as MetaData,
    title,
    body,
  }
}
