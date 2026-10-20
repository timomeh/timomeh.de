import { inArray } from 'drizzle-orm'
import type { CacheEntry, CacheHandler } from 'next/cache'

import { db, schema } from './db/client'

const CACHE_KEY_PREFIX = 'use-cache:'
const pendingSets = new Map<string, Promise<void>>()

type StoredEntry = Omit<CacheEntry, 'value' | 'expire'> & {
  value: string
  expire: number | null
}

function keyFor(cacheKey: string) {
  return `${CACHE_KEY_PREFIX}${cacheKey}`
}

function streamFromBase64(value: string) {
  const bytes = Buffer.from(value, 'base64')

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  })
}

const handler: CacheHandler = {
  async get(cacheKey, _softTags) {
    const key = keyFor(cacheKey)
    await pendingSets.get(key)

    try {
      const cached = await db.query.dataCaches.findFirst({
        where: (dataCache, q) => q.eq(dataCache.key, key),
      })

      if (!cached) return undefined

      const entry = JSON.parse(cached.value) as StoredEntry
      const invalidations = await db
        .select({
          staleAt: schema.cacheTagInvalidations.staleAt,
          expiredAt: schema.cacheTagInvalidations.expiredAt,
        })
        .from(schema.cacheTagInvalidations)
        .where(inArray(schema.cacheTagInvalidations.tag, entry.tags))

      let revalidate = entry.revalidate
      for (const invalidation of invalidations) {
        const staleAt = invalidation.staleAt.getTime()
        const expiredAt = invalidation.expiredAt.getTime()

        if (expiredAt <= Date.now() && expiredAt > entry.timestamp) {
          return undefined
        }

        if (staleAt > entry.timestamp) {
          revalidate = -1
        }
      }

      return {
        ...entry,
        expire: entry.expire ?? Infinity,
        revalidate,
        value: streamFromBase64(entry.value),
      }
    } catch (error) {
      console.error(`Error when getting cache key: ${cacheKey}`, error)
      return undefined
    }
  },

  async set(cacheKey, pendingEntry) {
    const key = keyFor(cacheKey)
    const operation = (async () => {
      const entry = await pendingEntry
      const bytes = new Uint8Array(
        await new Response(entry.value).arrayBuffer(),
      )
      const value: StoredEntry = {
        ...entry,
        expire: Number.isFinite(entry.expire) ? entry.expire : null,
        value: Buffer.from(bytes).toString('base64'),
      }

      await db
        .insert(schema.dataCaches)
        .values({
          key,
          value: JSON.stringify(value),
          tags: entry.tags,
          updatedAt: new Date(),
          expiredAt: Number.isFinite(entry.expire)
            ? new Date(entry.timestamp + entry.expire * 1000)
            : null,
        })
        .onConflictDoUpdate({
          target: schema.dataCaches.key,
          set: {
            value: JSON.stringify(value),
            tags: entry.tags,
            updatedAt: new Date(),
            expiredAt: Number.isFinite(entry.expire)
              ? new Date(entry.timestamp + entry.expire * 1000)
              : null,
          },
        })
    })()

    pendingSets.set(key, operation)
    try {
      await operation
    } catch (error) {
      console.error(`Error when setting cache key: ${cacheKey}`, error)
    } finally {
      pendingSets.delete(key)
    }
  },

  async refreshTags() {
    // Tag state is read from Postgres by get() and getExpiration().
  },

  async getExpiration(tags) {
    if (tags.length === 0) return 0

    const invalidations = await db
      .select({ expiredAt: schema.cacheTagInvalidations.expiredAt })
      .from(schema.cacheTagInvalidations)
      .where(inArray(schema.cacheTagInvalidations.tag, tags))

    return Math.max(
      ...invalidations.map(({ expiredAt }) => expiredAt.getTime()),
      0,
    )
  },

  async updateTags(tags, durations) {
    const staleAt = new Date()
    const expiredAt = durations?.expire
      ? new Date(staleAt.getTime() + durations.expire * 1000)
      : staleAt

    await Promise.all(
      tags.map((tag) =>
        db
          .insert(schema.cacheTagInvalidations)
          .values({ tag, staleAt, expiredAt })
          .onConflictDoUpdate({
            target: schema.cacheTagInvalidations.tag,
            set: { staleAt, expiredAt },
          }),
      ),
    )
  },
}

export default handler
