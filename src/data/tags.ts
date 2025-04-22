import { count, desc, eq } from 'drizzle-orm'
import { cache } from 'react'

import { db, schema } from '@/db/client'
import { log as baseLog } from '@/lib/log'

import { cms } from './cms'

const log = baseLog.child().withContext({ module: 'data/tags' })

export const listTags = cache(async () => {
  const tags = await db
    .select({
      id: schema.tags.id,
      title: schema.tags.title,
      slug: schema.tags.slug,
      postCount: count(schema.postTags.postId),
    })
    .from(schema.tags)
    .innerJoin(schema.postTags, eq(schema.tags.id, schema.postTags.tagId))
    .groupBy(schema.tags.id)
    .orderBy(desc(count(schema.postTags.postId)))

  return tags
})

export const getTagBySlug = cache(async (slug: string) => {
  const tag = await db.query.tags.findFirst({
    where: (tag, q) => q.eq(tag.slug, slug),
  })

  return tag
})

export async function updateTagCache(slug: string) {
  const tag = await cms.tags.get(slug)
  const storedTag = await db.query.tags.findFirst({
    where: (tag, q) => q.eq(tag.slug, slug),
  })

  if (!tag && storedTag) {
    log.withMetadata({ slug }).info('Removing record')
    await db.delete(schema.tags).where(eq(schema.tags.id, storedTag.id))
  }

  if (tag) {
    log.withMetadata({ slug }).info('Saving record')
    await db.insert(schema.tags).values(tag).onConflictDoUpdate({
      target: schema.posts.slug,
      set: tag,
    })
  }
}
