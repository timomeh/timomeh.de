import { desc, eq, sql } from 'drizzle-orm'
import { cache } from 'react'
import { db, schema } from '@/db/client'
import { log as baseLog } from '@/lib/log'
import { cms } from './cms'

const log = baseLog.child().withContext({ module: 'data/shorts' })

type Filter = {
  sort?: 'asc' | 'desc'
  limit?: number
}

export type Short = typeof schema.shorts.$inferSelect

export const listShorts = cache(async (filter: Filter = {}) => {
  const shorts = await db.query.shorts.findMany({
    orderBy: (short, q) => [
      filter.sort === 'asc'
        ? q.asc(short.publishedAt)
        : q.desc(short.publishedAt),
    ],
    limit: filter.limit,
  })

  return shorts
})

export const listShortsByYear = cache(
  async (year: number, filter: Filter = {}) => {
    const shorts = await db.query.shorts.findMany({
      where: (short, q) =>
        q.and(
          q.gte(short.publishedAt, new Date(`${year}-01-01`)),
          q.lt(short.publishedAt, new Date(`${year + 1}-01-01`)),
        ),
      orderBy: (short, q) => [
        filter.sort === 'asc'
          ? q.asc(short.publishedAt)
          : q.desc(short.publishedAt),
      ],
      limit: filter.limit,
    })

    return shorts
  },
)

export const listShortYears = cache(async () => {
  const shortYears = await db
    .select({
      year: sql<number>`CAST(strftime('%Y', datetime(${schema.shorts.publishedAt}, 'unixepoch')) AS INTEGER)`.as(
        'year',
      ),
      count: sql<number>`count(*)`.as('count'),
    })
    .from(schema.shorts)
    .groupBy(sql`year`)
    .orderBy(desc(sql`year`))

  return shortYears
})

export const getShortById = cache(async (id: string) => {
  const short = await db.query.shorts.findFirst({
    where: (short, q) => q.and(q.eq(short.id, id)),
  })

  return short
})

export async function cacheAllShorts() {
  const shorts = await cms.shorts.all()

  await db.delete(schema.shorts)
  await db.insert(schema.shorts).values(shorts)
}

export async function updateShortsCache(id: string) {
  const short = await cms.shorts.get(id)
  const storedShort = await db.query.shorts.findFirst({
    where: (short, q) => q.eq(short.id, id),
  })

  if (!short && storedShort) {
    log.withMetadata({ id }).info('Removing record')
    await db.delete(schema.shorts).where(eq(schema.shorts.id, storedShort.id))
  }

  if (short) {
    log.withMetadata({ id }).info('Saving record')
    await db.insert(schema.shorts).values(short).onConflictDoUpdate({
      target: schema.shorts.id,
      set: short,
    })
  }
}
