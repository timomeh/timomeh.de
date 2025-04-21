import { endOfYear, setYear, startOfYear } from 'date-fns'
import { cache } from 'react'

import { log as baseLog } from '@/lib/log'

import { cms, Post } from './cms'
import { db, repo } from './db'

const log = baseLog.child().withContext({ module: 'data/posts' })

type Filter = {
  tag?: string
  year?: number
  sort?: 'asc' | 'desc'
  status?: Post['status'][]
}

function transformSort(sort?: 'asc' | 'desc') {
  if (sort) return sort.toUpperCase() as 'ASC' | 'DESC'
  return null
}

export const listPublishedPosts = cache(async (filter: Filter = {}) => {
  await db.connect()

  const posts = await queryPosts({ ...filter, status: ['published'] })
    .sortBy('publishedAt', transformSort(filter.sort) || 'DESC')
    .return.all()

  return posts
})

export const getLatestPublishedPost = cache(async (filter: Filter = {}) => {
  await db.connect()

  const post = await queryPosts({ ...filter, status: ['published'] })
    .sortDesc('publishedAt')
    .return.first()

  return post
})

export const listPostYears = cache(async () => {
  const posts = await queryPosts({ status: ['published'] }).return.all()
  const postsByYear = posts.reduce(
    (acc, post) => {
      const year = new Date(post.publishedAt).getFullYear()
      acc[year] = (acc[year] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const yearsWithCount = Object.entries(postsByYear)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => b.year - a.year)

  return yearsWithCount
})

export const pagePublishedPosts = cache(
  async (year: number, filter: Filter = {}) => {
    await db.connect()

    let posts = await queryPosts({ ...filter, status: ['published'] })
      .where('publishedAt')
      .between(
        startOfYear(setYear(new Date(), year)),
        endOfYear(setYear(new Date(), year)),
      )
      .sortBy('publishedAt', transformSort(filter.sort) || 'DESC')
      .return.all()

    return posts
  },
)

export const getPost = cache(async (slug: string) => {
  await db.connect()

  const post = await queryPosts({ status: ['published', 'unlisted'] })
    .and('slug')
    .equals(slug)
    .return.first()

  return post
})

export const getOlderPost = cache(
  async (slug?: string, filter: Filter = {}) => {
    if (!slug) return null
    await db.connect()

    const currentPost = await getPost(slug)
    if (!currentPost) return null

    const olderPost = await queryPosts({ status: ['published'], ...filter })
      .where('publishedAt')
      .lessThan(currentPost.publishedAt)
      .sortDesc('publishedAt')
      .return.first()

    return olderPost
  },
)

export const getNewerPost = cache(
  async (slug?: string, filter: Filter = {}) => {
    if (!slug) return null
    await db.connect()

    const currentPost = await getPost(slug)
    if (!currentPost) return null

    const newerPost = await queryPosts({ status: ['published'], ...filter })
      .where('publishedAt')
      .greaterThan(currentPost.publishedAt)
      .sortAsc('publishedAt')
      .return.first()

    return newerPost
  },
)

function queryPosts(filter: Filter = {}) {
  let query = repo.posts.search()

  if (filter.status) {
    const [firstStatus, ...moreStatus] = filter.status
    query = query.where('status').equals(firstStatus)

    for (const status of moreStatus) {
      query = query.or('status').equals(status)
    }
  }

  if (filter.tag) {
    query = query.where('tags').contains(filter.tag)
  }

  if (filter.year) {
    query = query
      .where('publishedAt')
      .is.between(new Date(filter.year, 0, 1), new Date(filter.year + 1, 0, 1))
  }

  return query
}

export async function cacheAllPosts() {
  await db.connect()

  const posts = await cms.posts.all()
  const ids = await repo.posts.search().return.allIds()
  await repo.posts.remove(...ids)

  await Promise.all(posts.map((post) => repo.posts.save(post.slug, post)))

  try {
    await repo.posts.createIndex()
  } catch (error) {
    log.withError(error).warn('Error when trying to create the index for posts')
  }
}

export async function updatePostCache(slug: string) {
  await db.connect()

  const post = await cms.posts.get(slug)
  const cached = await repo.posts.fetch(slug)

  if (!post && cached) {
    log.withMetadata({ slug }).info('Removing record')
    await repo.posts.remove(slug)
  }

  if (post) {
    log.withMetadata({ slug }).info('Saving record')
    await repo.posts.save(slug, post)
  }
}
