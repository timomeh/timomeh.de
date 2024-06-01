import { cms } from '@/payload/client'

export class CategoryRepo {
  static async findAllPublic() {
    const result = await cms.find({
      collection: 'categories',
      limit: 99999,
      where: {
        visibility: { equals: 'public' },
      },
    })

    return result
  }

  static async findBySlug(slug: string) {
    const result = await cms.find({
      collection: 'categories',
      limit: 1,
      where: {
        slug: { equals: slug },
      },
    })

    return result
  }
}
