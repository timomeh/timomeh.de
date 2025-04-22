import { eq } from 'drizzle-orm'
import { cache } from 'react'

import { db, schema } from '@/db/client'
import { log as baseLog } from '@/lib/log'

import { cms } from './cms'

const log = baseLog.child().withContext({ module: 'data/pages' })

export const listPublicPages = cache(async () => {
  const pages = await db.query.pages.findMany({
    where: (page, q) => q.eq(page.visibility, 'public'),
  })

  return pages
})

export const getPageBySlug = cache(async (slug: string) => {
  const page = await db.query.pages.findFirst({
    where: (page, q) => q.eq(page.slug, slug),
  })

  return page
})

export async function cacheAllPages() {
  const pages = await cms.pages.all()

  await db.delete(schema.pages)
  await db.insert(schema.pages).values(pages)
}

export async function updatePageCache(slug: string) {
  const page = await cms.pages.get(slug)
  const storedPage = await db.query.pages.findFirst({
    where: (page, q) => q.eq(page.slug, slug),
  })

  if (!page && storedPage) {
    log.withMetadata({ slug }).info('Removing record')
    await db.delete(schema.pages).where(eq(schema.posts.id, storedPage.id))
  }

  if (page) {
    log.withMetadata({ slug }).info('Saving record')
    await db.insert(schema.pages).values(page).onConflictDoUpdate({
      target: schema.pages.slug,
      set: page,
    })
  }
}
