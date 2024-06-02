import { cms } from '@/payload/client'

export class PageRepo {
  static async findAllPublic() {
    const result = await cms.find({
      collection: 'pages',
      limit: 99999,
      depth: 1,
      sort: '-createdAt',
      where: {
        _status: { equals: 'published' },
        visibility: { equals: 'public' },
      },
    })

    return result
  }

  static async findBySlug(slug: string) {
    const result = await cms.find({
      collection: 'pages',
      limit: 1,
      depth: 1,
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
        visibility: { not_equals: 'private' },
      },
    })

    return result
  }
}
