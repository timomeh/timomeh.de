import { memoize } from 'nextjs-better-unstable-cache'
import { CategoryRepo } from './category.repository'

export const categoryCacheKey = {
  list: () => ['categories'],
  get: (slug: string) => ['category', `category-slug:${slug}`],
}

export const listCategories = memoize(
  async () => {
    const result = await CategoryRepo.findAllPublic()
    return result.docs
  },
  {
    revalidateTags: () => categoryCacheKey.list(),
  },
)

export const getCategoryBySlug = memoize(
  async (slug: string) => {
    const result = await CategoryRepo.findBySlug(slug)
    if (!result.docs[0]) return undefined
    return result.docs[0]
  },
  {
    revalidateTags: (slug) => categoryCacheKey.get(slug),
  },
)
