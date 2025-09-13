import type { MetadataRoute } from 'next'

import { config } from '@/config'
import { listPublicPages } from '@/data/pages'
import { getLatestPublishedPostByTag, listPublishedPosts } from '@/data/posts'
import { listTags } from '@/data/tags'

export default async function sitemap() {
  const [tags, years, posts, page] = await Promise.all([
    generateTagsSitemap(),
    generateYearlySitemap(),
    generatePostsSitemap(),
    generatePageSitemap(),
  ])

  const misc = [
    {
      url: fullUrl('/tags'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ] satisfies MetadataRoute.Sitemap

  return [
    ...years,
    ...tags,
    ...posts,
    ...misc,
    ...page,
  ] satisfies MetadataRoute.Sitemap
}

async function generateTagsSitemap() {
  const tags = await listTags()

  const sitemap = await Promise.all(
    tags.map(async (tag) => {
      const post = await getLatestPublishedPostByTag(tag.id)

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
  const pages = await listPublicPages()

  const sitemap = pages
    .filter((page) => !page.slug.startsWith('vrt-'))
    .map((page) => ({
      url: fullUrl(`/${page.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      lastModified: new Date(),
    }))

  return sitemap
}

function fullUrl(path: string) {
  return `${config.siteUrl}${path}`
}
