import { cms } from '@/payload/client'

export class PageRepo {
  static async findBySlug(slug: string) {
    const result = await cms.find({
      collection: 'pages',
      limit: 1,
      depth: 1,
      where: {
        slug: { equals: slug },
      },
    })

    return result
  }
}
