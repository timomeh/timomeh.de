import { cache } from 'react'

import { log as baseLog } from '@/lib/log'

import { cms, Page } from './cms'
import { db, repo } from './db'

const log = baseLog.child().withContext({ module: 'data/pages' })

type Filter = {
  visibility?: Page['visibility'][]
}

export const listPages = cache(async () => {
  await db.connect()

  const pages = await queryPages({ visibility: ['public'] }).return.all()

  return pages
})

export const getPage = cache(async (slug: string) => {
  await db.connect()

  const page = await queryPages({ visibility: ['public'] })
    .where('slug')
    .equals(slug)
    .return.first()

  return page
})

function queryPages(filter: Filter = {}) {
  let query = repo.pages.search()

  if (filter.visibility) {
    const [first, ...more] = filter.visibility
    query = query.where('visibility').equals(first)

    for (const visibility of more) {
      query = query.or('visibility').equals(visibility)
    }
  }

  return query
}

export async function cacheAllPages() {
  await db.connect()

  const pages = await cms.pages.all()
  const ids = await repo.pages.search().return.allIds()
  await repo.pages.remove(...ids)

  await Promise.all(pages.map((page) => repo.pages.save(page.slug, page)))

  try {
    await repo.pages.createIndex()
  } catch (error) {
    log.withError(error).warn('Error when trying to create the index for pages')
  }
}

export async function updatePageCache(slug: string) {
  await db.connect()

  const page = await cms.pages.get(slug)
  const cached = await repo.pages.fetch(slug)

  if (!page && cached) {
    log.withMetadata({ slug }).info('Removing record')
    await repo.pages.remove(slug)
  }

  if (page) {
    log.withMetadata({ slug }).info('Saving record')
    await repo.pages.save(slug, page)
  }
}
