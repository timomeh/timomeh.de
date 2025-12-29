import { and, desc, eq, sql } from 'drizzle-orm'
import { Vla } from 'vla'
import { db, schema } from '@/db/client'
import type { Post } from '../cms'

type Filter = {
  sort?: 'asc' | 'desc'
  limit?: number
}

export class PostsRepo extends Vla.Repo {
  all = this.memo(async () => {
    const posts = await db.query.posts.findMany()
    return posts
  })

  listPublished = this.memo(async (filter: Filter = {}) => {
    const posts = await db.query.posts.findMany({
      where: (post, q) => q.eq(post.status, 'published'),
      orderBy: (post, q) => [
        filter.sort === 'asc'
          ? q.asc(post.publishedAt)
          : q.desc(post.publishedAt),
      ],
      with: {
        postTags: {
          with: { tag: true },
        },
      },
    })

    return posts
  })

  listPublishedByYear = this.memo(async (year: number, filter: Filter = {}) => {
    const posts = await db.query.posts.findMany({
      where: (post, q) =>
        q.and(
          q.eq(post.status, 'published'),
          q.gte(post.publishedAt, new Date(`${year}-01-01`)),
          q.lt(post.publishedAt, new Date(`${year + 1}-01-01`)),
        ),
      orderBy: (post, q) => [
        filter.sort === 'asc'
          ? q.asc(post.publishedAt)
          : q.desc(post.publishedAt),
      ],
      limit: filter.limit,
      with: {
        postTags: {
          with: { tag: true },
        },
      },
    })

    return posts
  })

  listPublishedByTag = this.memo(async (tagId: number, filter: Filter = {}) => {
    const posts = await db.query.posts.findMany({
      where: (post, q) =>
        q.and(
          q.eq(post.status, 'published'),
          q.exists(
            db
              .select()
              .from(schema.postTags)
              .where(
                and(
                  eq(schema.postTags.postId, post.id),
                  eq(schema.postTags.tagId, tagId),
                ),
              ),
          ),
        ),
      orderBy: (post, q) => [
        filter.sort === 'asc'
          ? q.asc(post.publishedAt)
          : q.desc(post.publishedAt),
      ],
      with: {
        postTags: {
          with: { tag: true },
        },
      },
    })

    return posts
  })

  latestPublishedByTag = this.memo(async (tagId: number) => {
    const post = await db.query.posts.findFirst({
      where: (post, q) =>
        q.and(
          q.eq(post.status, 'published'),
          q.exists(
            db
              .select()
              .from(schema.postTags)
              .where(
                and(
                  eq(schema.postTags.postId, post.id),
                  eq(schema.postTags.tagId, tagId),
                ),
              ),
          ),
        ),
      orderBy: (post, q) => [q.desc(post.publishedAt)],
      with: {
        postTags: {
          with: { tag: true },
        },
      },
    })

    return post
  })

  listYears = this.memo(async () => {
    const postYears = await db
      .select({
        year: sql<number>`CAST(strftime('%Y', datetime(${schema.posts.publishedAt}, 'unixepoch')) AS INTEGER)`.as(
          'year',
        ),
        count: sql<number>`count(*)`.as('count'),
      })
      .from(schema.posts)
      .where(eq(schema.posts.status, 'published'))
      .groupBy(sql`year`)
      .orderBy(desc(sql`year`))

    return postYears
  })

  bySlug = this.memo(async (slug: string) => {
    const post = await db.query.posts.findFirst({
      where: (post, q) =>
        q.and(
          q.eq(post.slug, slug),
          q.or(q.eq(post.status, 'published'), q.eq(post.status, 'unlisted')),
        ),
      with: {
        postTags: {
          with: { tag: true },
        },
      },
    })

    return post
  })

  findOlder = this.memo(async (slug: string) => {
    const currentPost = await db.query.posts.findFirst({
      where: (post, q) =>
        q.and(q.eq(post.slug, slug), q.eq(post.status, 'published')),
    })

    if (!currentPost) return undefined

    const olderPost = await db.query.posts.findFirst({
      where: (post, q) =>
        q.and(
          q.eq(post.status, 'published'),
          q.lt(post.publishedAt, currentPost.publishedAt),
        ),
      orderBy: (post, q) => q.desc(post.publishedAt),
    })

    return olderPost
  })

  findNewer = this.memo(async (slug: string) => {
    const currentPost = await db.query.posts.findFirst({
      where: (post, q) =>
        q.and(q.eq(post.slug, slug), q.eq(post.status, 'published')),
    })

    if (!currentPost) return undefined

    const newerPost = await db.query.posts.findFirst({
      where: (post, q) =>
        q.and(
          q.eq(post.status, 'published'),
          q.gt(post.publishedAt, currentPost.publishedAt),
        ),
      orderBy: (post, q) => q.asc(post.publishedAt),
    })

    return newerPost
  })

  async delete(id: number) {
    await db.delete(schema.posts).where(eq(schema.posts.id, id))
  }

  async deleteAll() {
    await db.delete(schema.posts)
  }

  async insertMany(posts: Post[]) {
    return db.insert(schema.posts).values(posts).returning()
  }

  async upsertBySlug(post: Post) {
    const [updated] = await db
      .insert(schema.posts)
      .values(post)
      .onConflictDoUpdate({
        target: schema.posts.slug,
        set: post,
      })
      .returning()

    return updated
  }
}
