import { createGitHubReader } from '@keystatic/core/reader/github'
import { EntryWithResolvedLinkedFiles } from '@keystatic/core/reader'
import keystaticConfig from '@/keystatic.config'
import { markdownHeadline } from '@/lib/markdownHeadline'
import { config } from '@/config'

const reader = createGitHubReader(keystaticConfig, {
  repo: process.env.NEXT_PUBLIC_CMS_REPO! as `${string}/${string}`,
  token: config.github.contentPat,
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
        `https://raw.githubusercontent.com/${process.env.NEXT_PUBLIC_CMS_REPO}/main/${path}`,
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
) => ({
  status: post.status,
  title: post.title,
  headline: markdownHeadline(post.content),
  content: post.content,
  publishedAt: new Date(post.publishedAt),
  updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
  tags: post.tags.filter(Boolean),
  frontmatter: {
    cover: post.frontmatter.cover,
    readingTime: post.frontmatter.readingTime || null,
    kicker: post.frontmatter.kicker || null,
  },
  meta: {
    description: post.meta.description || null,
    image: post.meta.image,
    lang: post.meta.lang || null,
  },
})

const sanitizeTag = (
  tag: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['tags']
  >,
) => ({
  title: tag.title,
  color: tag.color,
  frontmatter: {
    kicker: tag.frontmatter.kicker || null,
  },
  meta: {
    description: tag.meta.description || null,
    image: tag.meta.image,
  },
})

const sanitizePage = (
  page: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['collections']['pages']
  >,
) => ({
  title: page.title,
  path: page.path,
  visibility: page.visibility,
  headline: markdownHeadline(page.content),
  content: page.content,
  frontmatter: {
    kicker: page.frontmatter.kicker || null,
  },
  meta: {
    description: page.meta.description || null,
    image: page.meta.image,
    lang: page.meta.lang || null,
  },
})

const sanitizeSettings = (
  settings: EntryWithResolvedLinkedFiles<
    (typeof keystaticConfig)['singletons']['settings']
  >,
) => ({
  tags: settings.tags.filter(Boolean),
  kickers: settings.kickers.filter(Boolean),
})
