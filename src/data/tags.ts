import { cache } from 'react'
import { db, repo } from './db'
import { cms } from './cms'

type Filter = {
  listed?: boolean
}

export const listTags = cache(async () => {
  await db.connect()

  const tags = await queryTags({ listed: true }).sortAsc('sort').return.all()
  return tags
})

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

  await Promise.all(tags.map((tag) => repo.tags.save(tag)))

  try {
    await repo.tags.createIndex()
  } catch (error) {
    console.warn('error when recreating index', error)
  }
}

export async function updateTagCache(slug: string) {
  await db.connect()

  const tag = await cms.tags.get(slug)
  const cachedId = await repo.tags
    .search()
    .where('slug')
    .eq(slug)
    .return.firstId()

  if (!tag && cachedId) {
    await repo.tags.remove(cachedId)
  }

  if (tag) {
    await repo.tags.save(tag)
  }
}