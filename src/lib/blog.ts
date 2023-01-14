import { cache } from 'react'

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

export const listOfftopicPaginated = cache(async (page = 0) => {
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
  return {
    slug: discussion.title,
    number: discussion.number,
    title: extractPostTitle(discussion.body) || discussion.title,
    postedAt: new Date(discussion.createdAt),
    updatedAt: new Date(discussion.updatedAt),
    markdown: discussion.body,
    html: discussion.bodyHTML,
  }
}

function toOfftopic(discussion: Discussion) {
  return {
    slug: discussion.title,
    number: discussion.number,
    title: extractPostTitle(discussion.body) || discussion.title,
    postedAt: new Date(discussion.createdAt),
    updatedAt: new Date(discussion.updatedAt),
    markdown: discussion.body,
    html: discussion.bodyHTML,
  }
}

function extractPostTitle(body: string) {
  const titleExp = /^# (.*$)/gim
  const matches = titleExp.exec(body)
  return matches?.[1].trim()
}

export function formatPostedAt(postedAt: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(new Date(postedAt))
}
