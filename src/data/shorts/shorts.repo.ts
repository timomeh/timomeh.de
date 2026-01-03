import { desc, eq, sql } from 'drizzle-orm'
import { Vla } from 'vla'
import { db, schema } from '@/db/client'
import type { Short as CmsShort } from '../cms'

export type Short = typeof schema.shorts.$inferSelect

type Filter = {
  sort?: 'asc' | 'desc'
  limit?: number
}

export class ShortsRepo extends Vla.Repo {
  list = this.memo(async (filter: Filter = {}) => {
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

  listByYear = this.memo(async (year: number, filter: Filter = {}) => {
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
  })

  listYears = this.memo(async () => {
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

  byId = this.memo(async (id: string) => {
    const short = await db.query.shorts.findFirst({
      where: (short, q) => q.and(q.eq(short.id, id)),
    })

    return short
  })

  async delete(id: string) {
    await db.delete(schema.shorts).where(eq(schema.shorts.id, id))
  }

  async deleteAll() {
    await db.delete(schema.shorts)
  }

  async insertMany(shorts: (Short | CmsShort)[]) {
    return db.insert(schema.shorts).values(shorts).returning()
  }

  async upsertById(short: Short | CmsShort) {
    const [updated] = await db
      .insert(schema.shorts)
      .values(short)
      .onConflictDoUpdate({
        target: schema.shorts.id,
        set: short,
      })
      .returning()

    return updated
  }
}
