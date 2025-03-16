import { MetadataRoute } from 'next'

import { config } from '@/config'
import { listPages } from '@/data/pages'
import { getLatestPublishedPost, listPublishedPosts } from '@/data/posts'
import { listTags } from '@/data/tags'

export default async function sitemap() {
  const [archiveTags, tags, pagination, posts, page] = await Promise.all([
    generateArchiveTagsSitemap(),
    generateTagsSitemap(),
    generateYearlySitemap(),
    generatePostsSitemap(),
    generatePageSitemap(),
  ])

  return [
    ...pagination,
    ...tags,
    ...archiveTags,
    ...posts,
    ...page,
  ] satisfies MetadataRoute.Sitemap
}

async function generateTagsSitemap() {
  const tags = await listTags()

  const sitemap = await Promise.all(
    tags.map(async (tag) => {
      const post = await getLatestPublishedPost({ tag: tag.slug })

      if (!post) return null

      return {
        url: fullUrl(`/tag/${tag.slug}`),
        changeFrequency: 'daily' as const,
        priority: 0.8,
        lastModified: post?.publishedAt || new Date(),
      }
    }),
  )

  return sitemap.filter((entry) => entry !== null)
}

async function generateYearlySitemap() {
  const posts = await listPublishedPosts()

  const seenYears = new Set<number>()

  const yearlyFirstPosts = posts.filter((post) => {
    const year = new Date(post.publishedAt).getFullYear()
    if (seenYears.has(year)) return false
    seenYears.add(year)
    return true
  })

  const thisYear = new Date().getFullYear()
  const sitemap = yearlyFirstPosts.map((post) => {
    const year = post.publishedAt.getFullYear()

    if (year === thisYear) {
      return {
        url: fullUrl('/'),
        changeFrequency: 'daily' as const,
        priority: 1,
        lastModified: post.publishedAt,
      }
    }

    return {
      url: fullUrl(`/in/${year}`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      lastModified: post.publishedAt,
    }
  })

  return sitemap
}

async function generateArchiveTagsSitemap() {
  const tags = await listTags()

  const tagsSitemap = await Promise.all(
    tags.map(async (tag) => {
      const posts = await listPublishedPosts({ tag: tag.slug })
      const dates = posts.map((post) => post.updatedAt || post.publishedAt)
      const latestDate = new Date(
        Math.max(...dates.map((date) => date.getTime())),
      )

      const sitemap = {
        url: fullUrl(`/archive/tag/${tag.slug}`),
        changeFrequency: 'daily' as const,
        priority: 0.8,
        lastModified: latestDate,
      }

      return sitemap
    }),
  )

  const posts = await listPublishedPosts()
  const dates = posts.map((post) => post.updatedAt || post.publishedAt)
  const latestDate = new Date(Math.max(...dates.map((date) => date.getTime())))

  const everythingSitemap = {
    url: fullUrl(`/archive`),
    changeFrequency: 'daily' as const,
    priority: 0.8,
    lastModified: latestDate,
  }

  return [everythingSitemap, ...tagsSitemap]
}

async function generatePostsSitemap() {
  const posts = await listPublishedPosts()

  const sitemap = posts.map((post) => ({
    url: fullUrl(`/posts/${post.slug}`),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    lastModified: post.updatedAt || post.publishedAt,
  }))

  return sitemap
}

async function generatePageSitemap() {
  const pages = await listPages()

  const sitemap = pages
    .filter((page) => !page.path.startsWith('vrt/'))
    .map((page) => ({
      url: fullUrl(`/${page.path}`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      lastModified: new Date(),
    }))

  return sitemap
}

function fullUrl(path: string) {
  return `${config.siteUrl}${path}`
}
