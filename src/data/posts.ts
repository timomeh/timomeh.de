import { endOfYear, setYear, startOfYear } from 'date-fns'
import { cache } from 'react'

import { log as baseLog } from '@/lib/log'
import { range } from '@/lib/range'

import { cms, Post } from './cms'
import { db, repo } from './db'

const log = baseLog.child().withContext({ module: 'data/posts' })

type Filter = {
  tag?: string
  year?: number
  status?: Post['status'][]
}

export const listPublishedPosts = cache(async (filter: Filter = {}) => {
  await db.connect()

  const posts = await queryPosts({ ...filter, status: ['published'] })
    .sortDesc('publishedAt')
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

export const pagePublishedPosts = cache(
  async (year: number, filter: Filter = {}) => {
    await db.connect()

    let posts = await queryPosts({ ...filter, status: ['published'] })
      .where('publishedAt')
      .between(
        startOfYear(setYear(new Date(), year)),
        endOfYear(setYear(new Date(), year)),
      )
      .sortDesc('publishedAt')
      .return.all()

    if (posts.length < 10) {
      const yearBeforePosts = await queryPosts({
        ...filter,
        status: ['published'],
      })
        .where('publishedAt')
        .before(startOfYear(setYear(new Date(), year)))
        .sortDesc('publishedAt')
        .return.page(0, Math.max(3, 10 - posts.length))

      posts = [...posts, ...yearBeforePosts]
    }

    return posts
  },
)

export const pageNumbersPublishedPosts = cache(async (filter: Filter = {}) => {
  await db.connect()

  const count = await queryPosts({ ...filter, status: ['published'] })
    .sortDesc('publishedAt')
    .return.count()

  const PAGINATION_SIZE = 20
  const pages = range(0, Math.ceil(count / PAGINATION_SIZE) - 1)

  return pages
})

export const getPublishedPostsRange = cache(async (filter: Filter = {}) => {
  await db.connect()

  const latest = await queryPosts({ ...filter, status: ['published'] })
    .sortDesc('publishedAt')
    .return.first()
  const earliest = await queryPosts({ ...filter, status: ['published'] })
    .sortAsc('publishedAt')
    .return.first()

  return [
    latest?.publishedAt || new Date(),
    earliest?.publishedAt || new Date(),
  ]
})

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
