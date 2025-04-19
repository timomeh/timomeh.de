import 'server-only'

import { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'

import { config } from '@/config'
import keystaticConfig from '@/keystatic.config'
import { cleanse } from '@/lib/cleanse'

const branch = 'development'

// everything related to fetching posts with keystatic

const reader = createGitHubReader(keystaticConfig, {
  repo: 'timomeh/timomeh.de-content',
  token: config.github.contentPat,
  ref: 'development',
})

export type Post = NonNullable<Awaited<ReturnType<typeof cms.posts.get>>>
export type Page = NonNullable<Awaited<ReturnType<typeof cms.pages.get>>>
export type Tag = NonNullable<Awaited<ReturnType<typeof cms.tags.get>>>
export type Settings = NonNullable<Awaited<ReturnType<typeof cms.settings.get>>>

export const cms = {
  posts: {
    async get(slug: string) {
      const post = await reader.collections.posts.read(slug, {
        resolveLinkedFiles: true,
      })
      if (!post) return null

      return { slug, ...sanitizePost(post) }
    },
    async all() {
      const posts = await reader.collections.posts.all({
        resolveLinkedFiles: true,
      })

      return posts.map(({ slug, entry }) => ({ slug, ...sanitizePost(entry) }))
    },
  },
  tags: {
    async get(slug: string) {
      const tag = await reader.collections.tags.read(slug, {
        resolveLinkedFiles: true,
      })
      if (!tag) return null

      const settings = await cms.settings.get()
      const sortedTags = settings?.tags || []

      return {
        slug,
        ...sanitizeTag(tag),
        sort: sortedTags.indexOf(slug),
      }
    },
    async all() {
      const tags = await reader.collections.tags.all({
        resolveLinkedFiles: true,
      })
      const settings = await cms.settings.get()
      const sortedTags = settings?.tags || []

      return tags.map(({ slug, entry }) => ({
        slug,
        ...sanitizeTag(entry),
        sort: sortedTags.indexOf(slug),
      }))
    },
  },
  pages: {
    async get(slug: string) {
      const page = await reader.collections.pages.read(slug, {
        resolveLinkedFiles: true,
      })
      if (!page) return null

      return { slug, ...sanitizePage(page) }
    },
    async all() {
      const pages = await reader.collections.pages.all({
        resolveLinkedFiles: true,
      })

      return pages.map(({ slug, entry }) => ({ slug, ...sanitizePage(entry) }))
    },
  },
  settings: {
    async get() {
      const settings = await reader.singletons.settings.read({
        resolveLinkedFiles: true,
      })
      if (!settings) return null

      return sanitizeSettings(settings)
    },
  },
  assets: {
    async get(path: string) {
      const res = await fetch(
        `https://raw.githubusercontent.com/timomeh/timomeh.de-content/${branch}/${path}`,
        {
          headers: {
            Authorization: `Bearer ${config.github.contentPat}`,
          },
          cache: 'force-cache',
        },
      )

      return res
    },
  },
}

export function contentAsset(
  type: 'posts' | 'pages' | 'tags',
  slug: string,
  path: string,
) {
  return path.startsWith('https:')
    ? path
    : contentAssetUrl(`${type}/${slug}/${path}`)
}

export function contentAssetUrl(path: string) {
  return `${config.siteUrl}/content-assets/${path}`
}

const sanitizePost = (
  post: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['posts']
  >,
) =>
  cleanse({
    status: post.status,
    title: post.title || '',
    content: post.content || '',
    publishedAt: new Date(post.publishedAt),
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
    tags: post.tags.filter(Boolean),
    frontmatter: {
      lightCover: post.frontmatter.lightCover || undefined,
      darkCover: post.frontmatter.darkCover || undefined,
      lightBgColor: post.frontmatter.lightBgColor || undefined,
      darkBgColor: post.frontmatter.darkBgColor || undefined,
      readingTime: post.frontmatter.readingTime || undefined,
      kicker: post.frontmatter.kicker || undefined,
    },
    meta: {
      description: post.meta.description || undefined,
      image: post.meta.image || undefined,
      lang: post.meta.lang || undefined,
    },
  })

const sanitizeTag = (
  tag: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['tags']
  >,
) =>
  cleanse({
    title: tag.title || '',
    color: tag.color || undefined,
    frontmatter: {
      kicker: tag.frontmatter.kicker || undefined,
    },
    meta: {
      description: tag.meta.description || undefined,
      image: tag.meta.image || undefined,
    },
  })

const sanitizePage = (
  page: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['pages']
  >,
) =>
  cleanse({
    title: page.title || '',
    path: page.path,
    visibility: page.visibility,
    content: page.content || '',
    frontmatter: {
      kicker: page.frontmatter.kicker || undefined,
    },
    meta: {
      description: page.meta.description || undefined,
      image: page.meta.image || undefined,
      lang: page.meta.lang || undefined,
    },
  })

const sanitizeSettings = (
  settings: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['singletons']['settings']
  >,
) =>
  cleanse({
    tags: settings.tags.filter(Boolean),
    kickers: settings.kickers.filter(Boolean),
  })
