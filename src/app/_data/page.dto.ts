import { memoize } from 'nextjs-better-unstable-cache'
import { PageRepo } from './page.repository'
import { Page } from '@/payload/payload-types'

export const pageCacheKey = {
  get: (slug: string) => ['page', `page-slug:${slug}`],
}

export const getPageBySlug = memoize(
  async (slug: string) => {
    const result = await PageRepo.findBySlug(slug)
    const doc = result.docs[0]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: (slug) => pageCacheKey.get(slug),
  },
)

function mapToFullDto(page: Page) {
  return {
    id: page.id,
    title: page.title,
    lang: page.lang,
    excerpt: page.excerpt_html || undefined,
    slug: page.slug,
    body: page.body_html || '',
  }
}

export type FullPageDto = ReturnType<typeof mapToFullDto>
