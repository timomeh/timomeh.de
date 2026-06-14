import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'

const tsvector = t.customType<{ data: string }>({
  dataType() {
    return 'tsvector'
  },
})

export const posts = t.pgTable(
  'posts',
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: t.text().notNull(),
    title: t.text().notNull(),
    status: t
      .text({ enum: ['draft', 'published', 'unlisted', 'archived'] })
      .notNull(),
    content: t.text().notNull(),
    publishedAt: t.timestamp({ withTimezone: true }).notNull(),
    updatedAt: t.timestamp({ withTimezone: true }),
    search: t.text(),
    relatedPosts: t.jsonb().$type<string[]>().notNull().default([]),
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

export const shorts = t.pgTable(
  'shorts',
  {
    id: t.text().primaryKey(),
    content: t.text(),
    attachments: t
      .jsonb()
      .$type<{ file: string; alt?: string | null }[]>()
      .default([]),
    publishedAt: t.timestamp({ withTimezone: true }).notNull(),
    kicker: t.text(),
    metaLang: t.text(),
  },
  (table) => [t.index('slug_published_at_idx').on(table.publishedAt)],
)

export const tags = t.pgTable(
  'tags',
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    title: t.text().notNull(),
    slug: t.text().notNull(),
    kicker: t.text(),
    color: t.text(),
    description: t.text(),
    search: t.text(),
    metaDescription: t.text(),
    metaImage: t.text(),
  },
  (table) => [t.uniqueIndex('tag_slug_idx').on(table.slug)],
)

export const pages = t.pgTable(
  'pages',
  {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
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

export const settings = t.pgTable('settings', {
  key: t.text({ enum: ['kickers', 'shortsAvatar'] }).primaryKey(),
  value: t.jsonb(),
})

export const postTags = t.pgTable(
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

export const postsSearch = t.pgTable(
  'posts_search',
  {
    postId: t
      .integer()
      .primaryKey()
      .references(() => posts.id, { onDelete: 'cascade' }),
    document: tsvector().notNull(),
  },
  (table) => [
    t.index('posts_search_document_idx').using('gin', table.document),
  ],
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

export const dataCaches = t.pgTable('data_caches', {
  key: t.text().primaryKey(),
  value: t.text().notNull(),
  tags: t.jsonb().$type<string[]>().default([]),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: t.timestamp({ withTimezone: true }),
  expiredAt: t.timestamp({ withTimezone: true }),
})
