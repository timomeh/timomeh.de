import { MetadataRoute } from 'next'

import { config } from '@/config'
import { listPages } from '@/data/pages'
import {
  listPublishedPosts,
  pageNumbersPublishedPosts,
  pagePublishedPosts,
} from '@/data/posts'
import { listTags } from '@/data/tags'

export default async function sitemap() {
  const [archiveTags, pagination, posts, page] = await Promise.all([
    generateArchiveTagsSitemap(),
    generatePaginationSitemap(),
    generatePostsSitemap(),
    generatePageSitemap(),
  ])

  return [
    ...pagination,
    ...archiveTags,
    ...posts,
    ...page,
  ] satisfies MetadataRoute.Sitemap
}

async function generatePaginationSitemap() {
  const tags = await listTags()

  const tagPageSitemaps = await Promise.all(
    tags.map(async (tag) => {
      const pageNumbers = await pageNumbersPublishedPosts({ tag: tag.slug })

      const tagsPagesSitemaps = await Promise.all(
        pageNumbers.map(async (number) => {
          const posts = await pagePublishedPosts(number, { tag: tag.slug })
          const dates = posts.map((post) => post.updatedAt || post.publishedAt)
          const latestDate = new Date(
            Math.max(...dates.map((date) => date.getTime())),
          )

          return {
            url:
              number === 0
                ? fullUrl(`/tag/${tag.slug}`)
                : fullUrl(`/tag/${tag.slug}/page/${number}`),
            changeFrequency: 'daily' as const,
            priority: 0.8,
            lastModified: latestDate,
          }
        }),
      )

      return tagsPagesSitemaps
    }),
  )

  const pageNumbers = await pageNumbersPublishedPosts()
  const pageSitemaps = await Promise.all(
    pageNumbers.map(async (number) => {
      const posts = await pagePublishedPosts(number)
      const dates = posts.map((post) => post.updatedAt || post.publishedAt)
      const latestDate = new Date(
        Math.max(...dates.map((date) => date.getTime())),
      )

      const everythingPages = {
        url: number === 0 ? fullUrl('/') : fullUrl(`/page/${number}`),
        changeFrequency: 'daily' as const,
        priority: 1,
        lastModified: latestDate,
      }

      return everythingPages
    }),
  )

  return [...pageSitemaps, ...tagPageSitemaps.flat()]
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

  const sitemap = pages.map((page) => ({
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
