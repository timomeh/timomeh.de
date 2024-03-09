import ellipsize from 'ellipsize'
import matter from 'gray-matter'
import { sortBy } from 'lodash'
import { memoize } from 'nextjs-better-unstable-cache'
import readingTime from 'reading-time'
import removeMd from 'remove-markdown'

import { Discussion, Label, listDiscussions } from './github'

export const listTags = memoize(
  async () => {
    const posts = await listPosts()
    const tagsWithCount = posts.reduce(
      (acc, post) => {
        post.tags.forEach((tag) => {
          if (acc[tag.slug]) acc[tag.slug].count++
          else acc[tag.slug] = { count: 1, tag }
        })
        return acc
      },
      {} as Record<string, { count: number; tag: BlogTag }>,
    )
    const sortedTags = sortBy(tagsWithCount, 'count')
      .reverse()
      .map(({ tag }) => tag)
    return sortedTags
  },
  {
    additionalCacheKey: ['listTags'],
    revalidateTags: ['tags', 'tags/all'],
    // @ts-expect-error
    duration: false,
  },
)

export const getTag = memoize(
  async (slug: string) => {
    const tags = await listTags()
    const tag = tags.find((t) => t.slug === slug)
    return tag
  },
  {
    additionalCacheKey: ['getTag'],
    revalidateTags: (slug) => ['tags', `tag/slug:${slug}`],
    // @ts-expect-error
    duration: false,
  },
)

export function isTag(name: string | undefined) {
  return name?.startsWith('tag:') ?? false
}

export function labelNameToSlug(name: string) {
  return name.replace(/^tag:/, '')
}

export function toTag(label: Label) {
  const slug = labelNameToSlug(label.name)
  const color = '#'.concat(label.color)

  return { slug, name: label.description || slug, color }
}

export type BlogTag = ReturnType<typeof toTag>

type ListPosts = {
  tag?: string
}

export const listPosts = memoize(
  async ({ tag }: ListPosts = {}) => {
    let discussions = await listDiscussions()
    let posts = discussions.map((discussion) => toPost(discussion))

    if (tag) {
      posts = posts.filter((post) => post.tags.some((t) => t.slug === tag))
    }

    return posts
  },
  {
    additionalCacheKey: ['listPosts'],
    revalidateTags: ({ tag } = {}) => [
      'posts',
      'posts/all',
      `posts/tagged:${tag || 'everything'}`,
    ],
    // @ts-expect-error
    duration: false,
  },
)

export const getPost = memoize(
  async (slug: string) => {
    const posts = await listPosts()
    const post = posts.find((p) => p.slug === slug)
    return post
  },
  {
    additionalCacheKey: ['getPost'],
    revalidateTags: (slug) => ['posts', `post/slug:${slug}`],
    // @ts-expect-error
    duration: false,
  },
)

function toPost(discussion: Discussion) {
  const { excerpt, meta, title, body, plainTitle, plainDescription } =
    parseDocument(discussion.body, { fakeExcerpt: true })
  const safeTitle = plainTitle || discussion.title
  const postedAt = discussion.createdAt
  const updatedAt = discussion.updatedAt
  const tags = discussion.labels.nodes
    .filter((label) => isTag(label.name))
    .map((label) => toTag(label))

  let description = plainDescription
  if (description.length < 30) {
    description = safeTitle
      .concat(', posted on ')
      .concat(
        new Date(postedAt).toLocaleDateString('en-US', { dateStyle: 'medium' }),
      )
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
