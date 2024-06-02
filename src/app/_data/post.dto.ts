import { memoize } from 'nextjs-better-unstable-cache'
import { PostRepo } from './post.repository'
import { Category, Post, Upload } from '@/payload/payload-types'
import readingTime from 'reading-time'
import { groupBy, range } from 'lodash'
import assert from 'assert'

export const postCacheKey = {
  list: {
    cache: (categorySlug?: string) =>
      categorySlug ? ['posts', `posts-category:${categorySlug}`] : ['posts'],
    invalidate: (categorySlug?: string) =>
      categorySlug ? `posts-category:${categorySlug}` : 'posts',
  },
  single: {
    cache: (slug: string) => ['post', `post-slug:${slug}`],
    invalidate: (slug: string) => `post-slug:${slug}`,
    invalidateAll: () => 'post',
  },
}

export const listPosts = memoize(
  async (categorySlug?: string) => {
    const result = categorySlug
      ? await PostRepo.findAllPublicByCategory(categorySlug)
      : await PostRepo.findAllPublic()

    const postSlugs = result.docs.map((doc) => doc.slug)
    return postSlugs
  },
  {
    revalidateTags: (categorySlug) => postCacheKey.list.cache(categorySlug),
  },
)

export const listPostsByYear = memoize(
  async (categorySlug?: string) => {
    const result = categorySlug
      ? await PostRepo.findAllPublicByCategory(categorySlug)
      : await PostRepo.findAllPublic()

    const posts = result.docs
    const latest = posts.at(0)
    const oldest = posts.at(-1)

    // just in case the world explodes, you never know
    if (!latest || !oldest) {
      return [{ year: new Date().getFullYear(), posts: [] }]
    }

    const latestYear = new Date(latest.publishedAt || Date.now()).getFullYear()
    const oldestYear = new Date(oldest.publishedAt || Date.now()).getFullYear()
    const years = range(oldestYear, latestYear! + 1).reverse()

    const byYear = groupBy(posts, (post) =>
      new Date(post.publishedAt || Date.now()).getFullYear(),
    )

    const listByYear = years.map((year) => ({
      year,
      posts: byYear[year]?.map((post) => post.slug) || [],
    }))

    return listByYear
  },
  {
    revalidateTags: (categorySlug) => postCacheKey.list.cache(categorySlug),
  },
)

export const getPostBySlug = memoize(
  async (slug: string) => {
    const result = await PostRepo.findBySlug(slug)
    const doc = result.docs[0]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: (slug) => postCacheKey.single.cache(slug),
  },
)

function mapToFullDto(post: Post) {
  return {
    id: post.id,
    cover: (post.cover as Upload | null) || undefined,
    categories: post.categories
      ? post.categories.map((category) => {
          assert(typeof category === 'object')
          return category.id
        })
      : [],
    title: post.title,
    lang: post.lang,
    readingTime:
      post.readingTime ||
      Math.ceil(readingTime(post.body_html || '').minutes).toString(),
    excerpt: post.excerpt_html || undefined,
    publishedAt: post.publishedAt || undefined,
    updatedAt: post.updatedAt,
    slug: post.slug,
    body: post.body_html || '',
    meta: {
      title: post.metaTitle || undefined,
      description: post.metaDescription || undefined,
      keywords: post.metaKeywords || undefined,
      ogImage:
        typeof post.ogImage === 'object' && !!post.ogImage?.url
          ? {
              url: post.ogImage.url,
              width: post.ogImage.width || undefined,
              height: post.ogImage.height || undefined,
            }
          : undefined,
    },
  }
}

export type PostDto = ReturnType<typeof mapToFullDto>
