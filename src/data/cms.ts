import 'server-only'

import type { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader'
import { createGitHubReader } from '@keystatic/core/reader/github'

import { config } from '@/config'
import keystaticConfig from '@/keystatic.config'
import { cleanse } from '@/lib/cleanse'

const branch = 'main'

// everything related to fetching posts with keystatic

const reader = createGitHubReader(keystaticConfig, {
  repo: 'timomeh/timomeh.de-content',
  token: config.github.contentPat,
  ref: branch,
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

      return { slug, ...sanitizeTag(tag) }
    },
    async all() {
      const tags = await reader.collections.tags.all({
        resolveLinkedFiles: true,
      })

      return tags.map(({ slug, entry }) => ({ slug, ...sanitizeTag(entry) }))
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
          cache: 'no-store',
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

const CONTENT_PROXY_URL =
  'http://github-content-proxy.railway.internal/raw-content'

export function contentAssetUrl(path: string) {
  return `${CONTENT_PROXY_URL}/${path}`
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
    lightCover: post.frontmatter.lightCover || undefined,
    darkCover: post.frontmatter.darkCover || undefined,
    lightBgColor: post.frontmatter.lightBgColor || undefined,
    darkBgColor: post.frontmatter.darkBgColor || undefined,
    readingTime: post.frontmatter.readingTime || undefined,
    kicker: post.frontmatter.kicker || undefined,
    metaDdescription: post.meta.description || undefined,
    metaImage: post.meta.image || undefined,
    metaLang: post.meta.lang || undefined,
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
    kicker: page.frontmatter.kicker || undefined,
    metaDescription: page.meta.description || undefined,
    metaImage: page.meta.image || undefined,
    metaLang: page.meta.lang || undefined,
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
