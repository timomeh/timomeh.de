import { and, desc, eq, sql } from 'drizzle-orm'
import { cache } from 'react'

import { db, schema } from '@/db/client'
import { log as baseLog } from '@/lib/log'

import { cms } from './cms'

const log = baseLog.child().withContext({ module: 'data/posts' })

type Filter = {
  sort?: 'asc' | 'desc'
  limit?: number
}

export const listPublishedPosts = cache(async (filter: Filter = {}) => {
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

export const listPublishedPostsByYear = cache(
  async (year: number, filter: Filter = {}) => {
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
  },
)

export const listPublishedPostsByTag = cache(
  async (tagId: number, filter: Filter = {}) => {
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
  },
)

export const getLatestPublishedPostByTag = cache(async (tagId: number) => {
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

export const listPostYears = cache(async () => {
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

export const getPostBySlug = cache(async (slug: string) => {
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

export const getOlderPostBySlug = cache(async (slug: string) => {
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

export const getNewerPostBySlug = cache(async (slug: string) => {
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

export async function cacheAllPostsAndTags() {
  const posts = await cms.posts.all()

  await db.delete(schema.posts)
  const insertedPosts = await db.insert(schema.posts).values(posts).returning()

  const tags = await cms.tags.all()
  await db.delete(schema.tags)
  const insertedTags = await db.insert(schema.tags).values(tags).returning()

  const tagsMap = Object.fromEntries(insertedTags.map((tag) => [tag.slug, tag]))
  const postsMap = Object.fromEntries(
    insertedPosts.map((post) => [post.slug, post]),
  )

  const postTags = posts.flatMap((post) =>
    post.tags.map((tag) => ({
      postId: postsMap[post.slug].id,
      tagId: tagsMap[tag].id,
    })),
  )
  await db.insert(schema.postTags).values(postTags)
}

export async function updatePostCache(slug: string) {
  const post = await cms.posts.get(slug)
  const storedPost = await db.query.posts.findFirst({
    where: (post, q) => q.eq(post.slug, slug),
  })

  if (!post && storedPost) {
    log.withMetadata({ slug }).info('Removing record')
    await db.delete(schema.posts).where(eq(schema.posts.id, storedPost.id))
  }

  if (post) {
    log.withMetadata({ slug }).info('Saving record')
    const [updatedPost] = await db
      .insert(schema.posts)
      .values(post)
      .onConflictDoUpdate({
        target: schema.posts.slug,
        set: post,
      })
      .returning()

    await db
      .delete(schema.postTags)
      .where(eq(schema.postTags.postId, updatedPost.id))
    const tags = await db.query.tags.findMany({
      where: (tags, q) => q.inArray(tags.slug, post.tags),
    })
    const postTags = tags.map((tag) => ({
      postId: updatedPost.id,
      tagId: tag.id,
    }))

    await db.insert(schema.postTags).values(postTags)
  }
}
