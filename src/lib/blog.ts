import { cache } from 'react'
import matter from 'gray-matter'

import { Discussion, getDiscussion, listDiscussions } from './github'

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

export const listOfftopicsPaginated = cache(async (page = 0) => {
  const limit = 2
  const start = page * limit
  const end = start + limit

  const offtopics = await listOfftopics()
  return offtopics.slice(start, end)
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
    excerpt: parsed.excerpt,
    meta: parsed.data as MetaData,
    title,
    body,
  }
}
