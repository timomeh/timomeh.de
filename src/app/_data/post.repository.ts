import { cms } from '@/payload/client'

export class PostRepo {
  static async findAllPublic() {
    const result = await cms.find({
      collection: 'posts',
      limit: 99999,
      depth: 1,
      where: { visibility: { equals: 'public' } },
      sort: '-publishedAt',
    })

    return result
  }

  static async findAllPublicByCategory(slug: string) {
    const result = await cms.find({
      collection: 'posts',
      limit: 99999,
      depth: 1,
      where: {
        visibility: { equals: 'public' },
        'categories.slug': { equals: slug },
      },
      sort: '-publishedAt',
    })

    return result
  }

  static async findBySlug(slug: string) {
    const result = await cms.find({
      collection: 'posts',
      limit: 1,
      depth: 1,
      where: {
        visibility: { not_equals: 'private' },
        slug: { equals: slug },
      },
    })

    return result
  }
}
