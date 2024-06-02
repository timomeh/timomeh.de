import { memoize } from 'nextjs-better-unstable-cache'
import { CategoryRepo } from './category.repository'
import { Category } from '@/payload/payload-types'

export const categoryCacheKey = {
  list: {
    cache: () => ['categories'],
    invalidate: () => 'categories',
  },
  single: {
    cache: (slug: string) => ['category', `category-slug:${slug}`],
    invalidate: (slug: string) => `category-slug:${slug}`,
    invalidateAll: () => 'category',
  },
}

export const listCategories = memoize(
  async () => {
    const result = await CategoryRepo.findAllPublic()
    return result.docs.map((category) => category.slug)
  },
  {
    revalidateTags: () => categoryCacheKey.list.cache(),
  },
)

export const getCategoryBySlug = memoize(
  async (slug: string) => {
    const result = await CategoryRepo.findBySlug(slug)
    const doc = result.docs[0]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: (slug) => categoryCacheKey.single.cache(slug),
  },
)

function mapToFullDto(category: Category) {
  return {
    id: category.id,
    color: category.color,
    name: category.name,
    slug: category.slug,
  }
}

export type CategoryDto = ReturnType<typeof mapToFullDto>
