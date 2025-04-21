import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { log as baseLog } from '@/lib/log'

import { cms } from './cms'
import { db, repo } from './db'
import { listPublishedPosts } from './posts'

const log = baseLog.child().withContext({ module: 'data/tags' })

type Filter = {
  listed?: boolean
}

export const listTags = cache(async () => {
  await db.connect()

  const tags = await queryTags({ listed: true }).return.all()
  const counts = await Promise.all(tags.map((tag) => cachedTagCount(tag.slug)))

  const tagsWithCount = tags
    .map((tag, i) => ({
      ...tag,
      postsCount: counts[i],
    }))
    .sort((a, b) => b.postsCount - a.postsCount)

  return tagsWithCount
})

const cachedTagCount = unstable_cache(
  async (tagSlug: string) => {
    const posts = await listPublishedPosts({ tag: tagSlug })
    return posts.length
  },
  ['tag-count'],
  { tags: ['tag-count'] },
)

export const getTag = cache(async (slug: string) => {
  await db.connect()

  const tag = await queryTags().where('slug').equals(slug).return.first()
  return tag
})

function queryTags(filter: Filter = {}) {
  let query = repo.tags.search()

  if (filter.listed) {
    query = query.where('sort').is.greaterThanOrEqualTo(0)
  }

  return query
}

export async function cacheAllTags() {
  await db.connect()

  const tags = await cms.tags.all()
  const ids = await repo.tags.search().return.allIds()
  await repo.tags.remove(...ids)

  await Promise.all(tags.map((tag) => repo.tags.save(tag.slug, tag)))

  try {
    await repo.tags.createIndex()
  } catch (error) {
    log.withError(error).warn('Error when trying to create the index for tags')
  }
}

export async function updateTagCache(slug: string) {
  await db.connect()

  const tag = await cms.tags.get(slug)
  const cached = await repo.tags.fetch(slug)

  if (!tag && cached) {
    log.withMetadata({ slug }).info('Removing record')
    await repo.tags.remove(slug)
  }

  if (tag) {
    log.withMetadata({ slug }).info('Saving record')
    await repo.tags.save(slug, tag)
  }
}
