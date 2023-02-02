import { cache } from 'react'
import matter from 'gray-matter'

import { Discussion, getDiscussion, listDiscussions } from './github'

export const listPostsPaginated = cache(async (page = 1) => {
  const limit = 10
  const start = (page - 1) * limit
  const end = start + limit

  const allPosts = await listPosts()
  const posts = allPosts.slice(start, end)
  const prev = page > 1 ? page - 1 : undefined
  const next = allPosts.length > end ? page + 1 : undefined

  return { posts, next, prev }
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
  const limit = 2
  const start = (page - 1) * limit
  const end = start + limit

  const allOfftopics = await listOfftopics()
  const offtopics = allOfftopics.slice(start, end)
  const prev = page > 1 ? page - 1 : undefined
  const next = allOfftopics.length > end ? page + 1 : undefined

  return { offtopics, next, prev }
})

export const getOfftopic = cache(async (slug: string) => {
  const discussion = await getDiscussion({ slug, category: 'offtopic' })
  return discussion && toOfftopic(discussion)
})

function toPost(discussion: Discussion) {
  const { excerpt, meta, title, body } = parseDocument(discussion.body)

  return {
    slug: discussion.title,
    number: discussion.number,
    postedAt: new Date(discussion.createdAt),
    updatedAt: new Date(discussion.updatedAt),
    title: title || discussion.title,
    meta,
    excerpt,
    body,
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
    meta,
    excerpt,
    body,
  }
}

export type Offtopic = ReturnType<typeof toOfftopic>

type MetaData = {
  description?: string
}

function parseDocument(document: string) {
  const excerptSeparator = '<!-- intro -->'
  const parsed = matter(document, {
    excerpt: true,
    excerpt_separator: excerptSeparator,
    delimiters: '~~~',
  })

  const content = parsed.content.split(excerptSeparator).at(-1) || ''
  const title = /^# (.*$)/gim.exec(content)?.[1].trim()
  const body = content.replace(/^# .*$/gim, '')

  return {
    // TODO delete fallback excerpt when properly supported
    excerpt: parsed.excerpt || body.split('\r\n').filter(Boolean)[0],
    meta: parsed.data as MetaData,
    title,
    body,
  }
}
