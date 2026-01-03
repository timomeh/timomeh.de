import type { MetadataRoute } from 'next'
import { Vla } from 'vla'
import { config } from '@/config'
import { PagesRepo } from '@/data/pages/pages.repo'
import { PostsRepo } from '@/data/posts/posts.repo'
import { ShortsRepo } from '@/data/shorts/shorts.repo'
import { TagsRepo } from '@/data/tags/tags.repo'
import { kernel } from '../data/kernel'

export default async function sitemap() {
  return GenerateSitemap.withKernel(kernel.scoped()).invoke()
}

class GenerateSitemap extends Vla.Action {
  tagsRepo = this.inject(TagsRepo)
  postsRepo = this.inject(PostsRepo)
  pagesRepo = this.inject(PagesRepo)
  shortsRepo = this.inject(ShortsRepo)

  async handle() {
    const [tags, years, posts, page, shorts] = await Promise.all([
      this.tagsSitemap(),
      this.yearlySitemap(),
      this.postsSitemap(),
      this.pagesSitemap(),
      this.shortsSitemap(),
    ])

    const sites = [
      {
        url: fullUrl('/tags'),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: fullUrl('/shorts'),
        changeFrequency: 'daily',
        priority: 1,
      },
    ] satisfies MetadataRoute.Sitemap

    return [
      ...years,
      ...sites,
      ...tags,
      ...posts,
      ...shorts,
      ...page,
    ] satisfies MetadataRoute.Sitemap
  }

  private async tagsSitemap() {
    const tags = await this.tagsRepo.list()

    const sitemap = await Promise.all(
      tags.map(async (tag) => {
        const post = await this.postsRepo.latestPublishedByTag(tag.id)

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

  private async yearlySitemap() {
    const posts = await this.postsRepo.listPublished()

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

  private async postsSitemap() {
    const posts = await this.postsRepo.listPublished()

    const sitemap = posts.map((post) => ({
      url: fullUrl(`/posts/${post.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      lastModified: post.updatedAt || post.publishedAt,
    }))

    return sitemap
  }

  private async pagesSitemap() {
    const pages = await this.pagesRepo.listPublic()

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

  private async shortsSitemap() {
    const shorts = await this.shortsRepo.list()

    const sitemap = shorts.map((short) => ({
      url: fullUrl(`/shorts/${short.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
      lastModified: short.publishedAt,
    }))

    return sitemap
  }
}

function fullUrl(path: string) {
  return `${config.siteUrl}${path}`
}
