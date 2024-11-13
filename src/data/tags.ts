import { cache } from 'react'
import { repo } from './db'
import { cms } from './cms'

type Filter = {
  listed?: boolean
}

export const listTags = cache(async () => {
  const tags = await queryTags({ listed: true }).sortAsc('sort').return.all()

  return tags
})

export const getTag = cache(async (slug: string) => {
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
  try {
    await repo.tags.createIndex()
  } catch (error) {
    console.warn('error when recreating index', error)
  }

  const tags = await cms.tags.all()
  const ids = await repo.tags.search().return.allIds()
  await repo.tags.remove(...ids)

  await Promise.all(tags.map((tag) => repo.tags.save(tag.slug, tag)))
}

export async function updateTagCache(slug: string) {
  const tag = await cms.tags.get(slug)
  const cached = await repo.tags.fetch(slug)

  if (!tag && cached) {
    await repo.tags.remove(slug)
  }

  if (tag) {
    await repo.tags.save(slug, tag)
  }
}
