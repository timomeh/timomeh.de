import { cache } from 'react'

import { logger } from '@/lib/log'

import { cms } from './cms'
import { db, repo } from './db'

const log = logger.child({ module: 'data/tags' })

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

  await Promise.all(tags.map((tag) => repo.tags.save(tag.slug, tag)))

  try {
    await repo.tags.createIndex()
  } catch (error) {
    log.warn(error, 'Error when trying to create the index for tags')
  }
}

export async function updateTagCache(slug: string) {
  await db.connect()

  const tag = await cms.tags.get(slug)
  const cached = await repo.tags.fetch(slug)

  if (!tag && cached) {
    log.info({ slug }, 'Removing record')
    await repo.tags.remove(slug)
  }

  if (tag) {
    log.info({ slug }, 'Saving record')
    await repo.tags.save(slug, tag)
  }
}
