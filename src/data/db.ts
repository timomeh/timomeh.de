import { createClient } from 'redis'
import { Repository, Schema } from 'redis-om'
import { Page, Post, Settings, Tag } from './cms'

const redisSingleton = () =>
  createClient({ url: process.env.REDIS_DB_URL }).on('error', (err) =>
    console.log('Redis client error', err),
  )

declare const globalThis: {
  redisGlobal: ReturnType<typeof redisSingleton>
} & typeof global

const redis = globalThis.redisGlobal ?? redisSingleton()

globalThis.redisGlobal = redis

const postSchema = new Schema('post', {
  title: { type: 'text' },
  slug: { type: 'string' },
  status: { type: 'string' },
  content: { type: 'text' },
  publishedAt: { type: 'date', sortable: true },
  updatedAt: { type: 'date' },
  tags: { type: 'string[]' },
  frontmatter_cover: { type: 'string', path: '$.frontmatter.cover' },
  frontmatter_readingTime: { type: 'text', path: '$.frontmatter.readingTime' },
  frontmatter_kicker: { type: 'text', path: '$.frontmatter.kicker' },
  meta_description: { type: 'text', path: '$.meta.description' },
  meta_image: { type: 'string', path: '$.meta.image' },
  meta_lang: { type: 'string', path: '$.meta.lang' },
})

const tagSchema = new Schema('tag', {
  title: { type: 'text' },
  slug: { type: 'string' },
  color: { type: 'string' },
  sort: { type: 'number', sortable: true },
  frontmatter_kicker: { type: 'text', path: '$.frontmatter.kicker' },
  meta_description: { type: 'text', path: '$.meta.description' },
  meta_image: { type: 'string', path: '$.meta.image' },
})

const pageSchema = new Schema('page', {
  title: { type: 'text' },
  slug: { type: 'string' },
  path: { type: 'string' },
  visibility: { type: 'string' },
  content: { type: 'text' },
  frontmatter_kicker: { type: 'text', path: '$.frontmatter.kicker' },
  meta_description: { type: 'text', path: '$.meta.description' },
  meta_lang: { type: 'text', path: '$.meta.lang' },
})

const settingsSchema = new Schema('settings', {
  tags: { type: 'string[]' },
  kickers: { type: 'string[]' },
})

export const repo = {
  posts: new Repository<Post>(postSchema, redis),
  tags: new Repository<Tag>(tagSchema, redis),
  pages: new Repository<Page>(pageSchema, redis),
  settings: new Repository<Settings>(settingsSchema, redis),
}

export async function initRedis() {
  await redis.connect()

  try {
    await repo.posts.createIndex()
    await repo.tags.createIndex()
    await repo.pages.createIndex()
    await repo.settings.createIndex()
  } catch (e) {
    console.log('An error happened when creating redis indices', e)
  }
}
