import { cache } from 'react'
import { createClient } from 'redis'
import { Repository, Schema } from 'redis-om'

import { config } from '@/config'
import { logger } from '@/lib/log'

import { Page, Post, Settings, Tag } from './cms'

const log = logger.child({ module: 'data/db' })

const redis = createClient({ url: config.redis.url }).on('error', (err) =>
  log.error(err, 'Redis client error'),
)

const connect = cache(async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
})

export const db = { redis, connect }

const postSchema = new Schema('posts', {
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

const tagSchema = new Schema('tags', {
  title: { type: 'text' },
  slug: { type: 'string' },
  color: { type: 'string' },
  sort: { type: 'number', sortable: true },
  frontmatter_kicker: { type: 'text', path: '$.frontmatter.kicker' },
  meta_description: { type: 'text', path: '$.meta.description' },
  meta_image: { type: 'string', path: '$.meta.image' },
})

const pageSchema = new Schema('pages', {
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
  await connect()

  try {
    log.info('Creating indices...')
    await repo.posts.createIndex()
    await repo.tags.createIndex()
    await repo.pages.createIndex()
    await repo.settings.createIndex()
  } catch (e) {
    log.error(e, 'Error when creating redis indices')
  } finally {
    log.info('Successfully (re-)created all indices')
  }
}
