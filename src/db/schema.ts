import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/sqlite-core'

export const posts = t.sqliteTable(
  'posts',
  {
    id: t.integer().primaryKey({ autoIncrement: true }),
    slug: t.text().notNull(),
    title: t.text().notNull(),
    status: t
      .text({ enum: ['draft', 'published', 'unlisted', 'archived'] })
      .notNull(),
    content: t.text().notNull(),
    publishedAt: t.integer({ mode: 'timestamp' }).notNull(),
    updatedAt: t.integer({ mode: 'timestamp' }),
    lightCover: t.text(),
    darkCover: t.text(),
    lightBgColor: t.text(),
    darkBgColor: t.text(),
    readingTime: t.text(),
    kicker: t.text(),
    metaDescription: t.text(),
    metaImage: t.text(),
    metaLang: t.text(),
  },
  (table) => [
    t.uniqueIndex('post_slug_idx').on(table.slug),
    t.index('post_published_at_idx').on(table.publishedAt),
    t.index('post_status_idx').on(table.status),
  ],
)

export const tags = t.sqliteTable(
  'tags',
  {
    id: t.integer().primaryKey({ autoIncrement: true }),
    title: t.text().notNull(),
    slug: t.text().notNull(),
    kicker: t.text(),
    metaDescription: t.text(),
    metaImage: t.text(),
  },
  (table) => [t.uniqueIndex('tag_slug_idx').on(table.slug)],
)

export const pages = t.sqliteTable(
  'pages',
  {
    id: t.integer().primaryKey({ autoIncrement: true }),
    slug: t.text().notNull(),
    title: t.text().notNull(),
    visibility: t.text({ enum: ['public', 'private'] }).notNull(),
    content: t.text().notNull(),
    kicker: t.text(),
    metaDescription: t.text(),
    metaLang: t.text(),
    metaImage: t.text(),
  },
  (table) => [
    t.index('page_visibility_idx').on(table.visibility),
    t.uniqueIndex('page_slug_idx').on(table.slug),
  ],
)

export const settings = t.sqliteTable('settings', {
  key: t.text({ enum: ['kickers'] }).primaryKey(),
  value: t.text({ mode: 'json' }),
})

export const postTags = t.sqliteTable(
  'post_tags',
  {
    postId: t
      .integer()
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: t
      .integer()
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [t.primaryKey({ columns: [table.postId, table.tagId] })],
)

export const postsRelations = relations(posts, ({ many }) => ({
  postTags: many(postTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}))

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}))
