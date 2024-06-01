import { memoize } from 'nextjs-better-unstable-cache'
import { PostRepo } from './post.repository'
import { Category, Post, Upload } from '@/payload/payload-types'
import readingTime from 'reading-time'

export const postCacheKey = {
  list: () => ['posts'],
  listByCategory: (slug: string) => ['posts', `posts-category:${slug}`],
  get: (slug: string) => ['post', `post-slug:${slug}`],
}

export const listPosts = memoize(
  async () => {
    const result = await PostRepo.findAllPublic()
    const posts = result.docs.map(mapToShortDto)
    return posts
  },
  {
    revalidateTags: () => postCacheKey.list(),
  },
)

export const listPostsByCategory = memoize(
  async (slug: string) => {
    const result = await PostRepo.findAllPublicByCategory(slug)
    const posts = result.docs.map(mapToShortDto)
    return posts
  },
  {
    revalidateTags: (slug) => postCacheKey.listByCategory(slug),
  },
)

export const getPostBySlug = memoize(
  async (slug: string) => {
    const result = await PostRepo.findBySlug(slug)
    const doc = result.docs[0]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: (slug) => postCacheKey.get(slug),
  },
)

export const getNextPostBySlug = memoize(
  async (slug: string) => {
    const result = await PostRepo.findAllPublic()
    const index = result.docs.findIndex((post) => post.slug === slug)
    if (index === -1) return undefined
    const doc = result.docs[index - 1]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: () => postCacheKey.list(),
  },
)

export const getPrevPostBySlug = memoize(
  async (slug: string) => {
    const result = await PostRepo.findAllPublic()
    const index = result.docs.findIndex((post) => post.slug === slug)
    if (index === -1) return undefined
    const doc = result.docs[index + 1]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: () => postCacheKey.list(),
  },
)

function mapToShortDto(post: Post) {
  return {
    id: post.id,
    cover: (post.cover as Upload | null) || undefined,
    categories: (post.categories as Category[]) || [],
    title: post.title,
    lang: post.lang || undefined,
    readingTime:
      post.readingTime ||
      Math.ceil(readingTime(post.body_html || '').minutes).toString(),
    excerpt: post.excerpt_html || undefined,
    publishedAt: post.publishedAt || undefined,
    updatedAt: post.updatedAt,
    slug: post.slug,
  }
}

function mapToFullDto(post: Post) {
  return {
    id: post.id,
    cover: (post.cover as Upload | null) || undefined,
    categories: (post.categories as Category[]) || [],
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
  }
}

export type FullPostDto = ReturnType<typeof mapToFullDto>
export type ShortPostDto = ReturnType<typeof mapToShortDto>
