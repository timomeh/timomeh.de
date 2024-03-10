import { Discussion, Label } from '@octokit/graphql-schema'
import ellipsize from 'ellipsize'
import matter from 'gray-matter'
import { groupBy, range } from 'lodash'
import readingTime from 'reading-time'
import removeMd from 'remove-markdown'

import {
  fetchDiscussion,
  fetchLabel,
  fetchSortedDiscussions,
  fetchSortedLabels,
  isTag,
} from './github'

export async function listTags() {
  const labels = await fetchSortedLabels()
  const slugs = labels.map((label) => labelNameToSlug(label.name))
  return slugs
}

export async function getTag(slug: string) {
  const labels = await fetchSortedLabels()
  if (!labels.some((label) => labelNameToSlug(label.name) === slug)) {
    return null
  }

  const label = await fetchLabel(`tag:${slug}`)
  const tag = toTag(label)
  return tag
}

export function labelNameToSlug(name: string) {
  return name.replace(/^tag:/, '')
}

export function toTag(label: Pick<Label, 'name' | 'color' | 'description'>) {
  const slug = labelNameToSlug(label.name)
  const color = '#'.concat(label.color)

  return { slug, name: label.description || slug, color }
}

export type BlogTag = ReturnType<typeof toTag>

type ListPostsFilter = {
  tag?: string
}

export async function listPosts(filter: ListPostsFilter = {}) {
  const discussions = await fetchSortedDiscussions({ label: filter.tag })
  const slugs = discussions.map((discussion) => discussion.title)
  return slugs
}

export async function listPostsByYear(filter: ListPostsFilter = {}) {
  const discussions = await fetchSortedDiscussions({ label: filter.tag })
  const latest = discussions.at(0)
  const oldest = discussions.at(-1)

  // just in case the world explodes, you never know
  if (!latest || !oldest) {
    return [{ year: new Date().getFullYear(), posts: [] }]
  }

  const latestYear = new Date(latest.createdAt).getFullYear()
  const oldestYear = new Date(oldest.createdAt).getFullYear()
  const years = range(oldestYear, latestYear! + 1).reverse()

  const byYear = groupBy(discussions, (discussion) =>
    new Date(discussion.createdAt).getFullYear(),
  )

  const list = years.map((year) => ({
    year,
    posts: byYear[year].map((discussion) => discussion.title) || [],
  }))

  return list
}

export async function getPost(slug: string) {
  const discussions = await fetchSortedDiscussions()
  if (!discussions.some((discussion) => discussion.title === slug)) {
    return null
  }
  const discussion = await fetchDiscussion(slug)

  const post = toPost(discussion)
  return post
}

export async function getRelatedPosts(slug: string) {
  const posts = await listPosts()
  const index = posts.findIndex((post) => post === slug)

  if (index === -1) {
    return { prev: null, next: null }
  }

  const next = posts[index - 1] || null
  const prev = posts[index + 1] || null
  return { prev, next }
}

function toPost(discussion: Discussion) {
  const { excerpt, meta, title, body, plainTitle, plainDescription } =
    parseDocument(discussion.body, { fakeExcerpt: true })

  const safeTitle = plainTitle || discussion.title
  const postedAt = discussion.createdAt
  const updatedAt = discussion.updatedAt
  const tags =
    discussion.labels?.nodes
      ?.filter((label): label is Label => isTag(label?.name))
      .map((label) => labelNameToSlug(label.name)) || []

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
