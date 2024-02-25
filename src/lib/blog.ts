import ellipsize from 'ellipsize'
import matter from 'gray-matter'
import { groupBy, range } from 'lodash'
import { cache } from 'react'
import readingTime from 'reading-time'
import removeMd from 'remove-markdown'

import {
  Discussion,
  getDiscussion,
  Label,
  listDiscussions,
  listLabels,
} from './github'

export const listTags = cache(async () => {
  const labels = await listLabels()
  return labels.map((label) => toTag(label))
})

function toTag(label: Label) {
  const slug = label.name.replace(/^tag:/, '')
  const color = '#'.concat(label.color)

  return { slug, name: label.description, color }
}

export type BlogTag = ReturnType<typeof toTag>

type ListPosts = {
  tag?: string
}

export const listPosts = cache(async ({ tag }: ListPosts = {}) => {
  let discussions = await listDiscussions()
  let posts = discussions.map((discussion) => toPost(discussion))

  if (tag) {
    posts = posts.filter((post) => post.tags.some((t) => t.slug === tag))
  }

  return posts
})

export function groupPostsByYear(posts: Post[]) {
  const latestPost = posts.at(0)
  const oldestPost = posts.at(-1)

  // just in case, you never know
  if (!latestPost || !oldestPost) {
    return [{ year: new Date().getFullYear(), posts: [] }]
  }

  const latestYear = latestPost.postedAt.getFullYear()
  const oldestYear = oldestPost.postedAt.getFullYear()
  const years = range(oldestYear, latestYear! + 1).reverse()

  const postsByYear = groupBy(posts, (post) => post.postedAt.getFullYear())

  return years.map((year) => ({
    year,
    posts: postsByYear[year] || [],
  }))
}

export const getPost = cache(async (slug: string) => {
  const discussion = await getDiscussion({ slug })
  return discussion && toPost(discussion)
})

function toPost(discussion: Discussion) {
  const { excerpt, meta, title, body, plainTitle, plainDescription } =
    parseDocument(discussion.body, { fakeExcerpt: true })
  const safeTitle = plainTitle || discussion.title
  const postedAt = new Date(discussion.createdAt)
  const updatedAt = new Date(discussion.updatedAt)
  const tags = discussion.labels.nodes.map((label) => toTag(label))

  let description = plainDescription
  if (description.length < 30) {
    description = safeTitle
      .concat(', posted on ')
      .concat(postedAt.toLocaleDateString('en-US', { dateStyle: 'medium' }))
      .concat(' by Timo Mämecke')
  }

  const { minutes } = readingTime(body)

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
    tags,
    estMinutes: Math.round(minutes) || 1,
  }
}

export type Post = ReturnType<typeof toPost>

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

  const meta = {
    lang: 'en_US',
    ...(parsed.data as MetaData),
  }
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
