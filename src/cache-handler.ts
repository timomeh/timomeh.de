import { sql } from 'drizzle-orm'

import { db, schema } from './db/client'

export default class SQLiteCacheHandler {
  async get(key: string) {
    try {
      const cached = await db.query.dataCaches.findFirst({
        where: (dataCache, q) => q.eq(dataCache.key, key),
      })

      return cached
        ? {
            value: JSON.parse(cached.value),
            lastModifiedAt: Date.now(),
            tags: cached.tags,
          }
        : null
    } catch (e) {
      console.error(`Error when getting cache key: ${key}`, e)
      return null
    }
  }

  async set(
    key: string,
    data: { revalidate: number },
    ctx: { tags: string[] },
  ) {
    const threeYearsSeconds = 94_608_000
    const revalidate = Math.min(data.revalidate, threeYearsSeconds)
    try {
      await db
        .insert(schema.dataCaches)
        .values({
          key,
          value: JSON.stringify(data || {}),
          expiredAt: new Date(Date.now() + revalidate * 1000),
          tags: ctx.tags,
        })
        .onConflictDoUpdate({
          target: schema.dataCaches.key,
          set: {
            value: JSON.stringify(data || {}),
            expiredAt: new Date(Date.now() + revalidate * 1000),
            tags: ctx.tags,
          },
        })
    } catch (e) {
      console.error(`Error when setting cache key: ${key}`, e)
    }
  }

  async revalidateTag(unsafeTags: string[] | string) {
    const tags = [unsafeTags].flat()

    await db.delete(schema.dataCaches).where(sql`exists (
      select 1 from json_each(${schema.dataCaches.tags})
      where json_each.value in (${sql.join(tags, sql`, `)})
    )`)
  }

  resetRequestCache() {
    // noop
  }
}
