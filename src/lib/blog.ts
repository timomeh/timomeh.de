import { cache } from 'react'
import matter from 'gray-matter'
import ellipsize from 'ellipsize'
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
  const { excerpt, meta, title, body, plainTitle, plainDescription } =
    parseDocument(discussion.body, { fakeExcerpt: true })
  const safeTitle = plainTitle || discussion.title
  const postedAt = new Date(discussion.createdAt)
  const updatedAt = new Date(discussion.updatedAt)

  let description = plainDescription
  if (description.length < 30) {
    description = safeTitle
      .concat(', posted on ')
      .concat(postedAt.toLocaleDateString('en-US', { dateStyle: 'medium' }))
      .concat(' by Timo Mämecke')
  }

  return {
    slug: discussion.title,
    number: discussion.number,
    postedAt,
    updatedAt,
    title: title || safeTitle,
    description,
    safeTitle,
    meta,
    excerpt,
    body,
    bodyHTML: discussion.bodyHTML,
  }
}

export type Post = ReturnType<typeof toPost>

function toOfftopic(discussion: Discussion) {
  const { excerpt, meta, title, body, plainTitle, plainDescription } =
    parseDocument(discussion.body)
  const safeTitle = plainTitle || discussion.title
  const postedAt = new Date(discussion.createdAt)
  const updatedAt = new Date(discussion.updatedAt)

  let description = plainDescription
  if (description.length < 20) {
    description = safeTitle
      .concat(', posted on ')
      .concat(postedAt.toLocaleDateString('en-US', { dateStyle: 'medium' }))
      .concat(' by Timo Mämecke')
  }

  return {
    slug: discussion.title,
    number: discussion.number,
    postedAt,
    updatedAt,
    title,
    safeTitle,
    description,
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

function parseDocument(document: string, { fakeExcerpt = false } = {}) {
  const excerptSeparator = '<!-- intro -->'
  const parsed = matter(document, {
    excerpt: true,
    excerpt_separator: excerptSeparator,
    delimiters: '~~~',
  })

  const meta = parsed.data as MetaData
  const title = /^# (.*$)/gim.exec(document)?.[1].trim()
  const content = parsed.content.split(excerptSeparator).at(-1) || ''
  const body = content.replace(/^# .*$/gim, '')

  const excerpt = fakeExcerpt
    ? parsed.excerpt?.replace(/^# (.*$)/gim, '') ||
      body.split('\r\n').filter(Boolean)[0]
    : parsed.excerpt?.replace(/^# (.*$)/gim, '')

  const plainDescription =
    meta.description || ellipsize(cleanText(excerpt || body), 160)
  const plainTitle =
    cleanText(meta.title || title || '') ||
    ellipsize(cleanText(excerpt || body), 50)

  return {
    excerpt,
    meta,
    title,
    body,
    plainTitle,
    plainDescription: plainDescription.trim(),
  }
}

function cleanText(text: string) {
  let cleaned = removeMd(text, { useImgAltText: false })
  cleaned = cleaned.replace(/(?:https?):\/\/[\n\S]+/gi, '') // remove stray links (embeds)
  cleaned = cleaned.replace(/(?:\r\n|\r|\n)/g, ' ') // remove newlines

  return cleaned
}
