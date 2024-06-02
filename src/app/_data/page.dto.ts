import { memoize } from 'nextjs-better-unstable-cache'
import { PageRepo } from './page.repository'
import { Page } from '@/payload/payload-types'

export const pageCacheKey = {
  list: {
    cache: () => ['pages'],
    invalidate: () => 'pages',
  },
  single: {
    cache: (slug: string) => ['page', `page-slug:${slug}`],
    invalidate: (slug: string) => `page-slug:${slug}`,
    invalidateAll: () => 'page',
  },
}

export const listPages = memoize(
  async () => {
    const result = await PageRepo.findAllPublic()

    const pageSlugs = result.docs.map((doc) => doc.slug)
    return pageSlugs
  },
  {
    revalidateTags: () => pageCacheKey.list.cache(),
  },
)

export const getPageBySlug = memoize(
  async (slug: string) => {
    const result = await PageRepo.findBySlug(slug)
    const doc = result.docs[0]
    return doc ? mapToFullDto(doc) : undefined
  },
  {
    revalidateTags: (slug) => pageCacheKey.single.cache(slug),
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
    updatedAt: page.updatedAt,
    meta: {
      title: page.metaTitle || undefined,
      description: page.metaDescription || undefined,
      keywords: page.metaKeywords || undefined,
      ogImage:
        typeof page.ogImage === 'object' && !!page.ogImage?.url
          ? {
              url: page.ogImage.url,
              width: page.ogImage.width || undefined,
              height: page.ogImage.height || undefined,
            }
          : undefined,
    },
  }
}

export type PageDto = ReturnType<typeof mapToFullDto>
