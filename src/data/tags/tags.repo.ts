import { count, desc, eq } from 'drizzle-orm'
import { Vla } from 'vla'
import { db, schema } from '@/db/client'
import type { Tag } from '../cms'

export class TagsRepo extends Vla.Repo {
  all = this.memo(async () => {
    const tags = await db.query.tags.findMany()
    return tags
  })

  list = this.memo(async () => {
    const tags = await db
      .select({
        id: schema.tags.id,
        title: schema.tags.title,
        slug: schema.tags.slug,
        kicker: schema.tags.kicker,
        metaDescription: schema.tags.metaDescription,
        metaImage: schema.tags.metaImage,
        postCount: count(schema.postTags.postId),
      })
      .from(schema.tags)
      .innerJoin(schema.postTags, eq(schema.tags.id, schema.postTags.tagId))
      .groupBy(schema.tags.id)
      .orderBy(desc(count(schema.postTags.postId)))

    for (const tag of tags) {
      this.bySlug.prime(tag.slug).value(Promise.resolve(tag))
    }

    return tags
  })

  bySlug = this.memo(async (slug: string) => {
    const tag = await db.query.tags.findFirst({
      where: (tag, q) => q.eq(tag.slug, slug),
    })

    return tag
  })

  findManyBySlugs = this.memo(async (slugs: string[]) => {
    const tags = await db.query.tags.findMany({
      where: (tags, q) => q.inArray(tags.slug, slugs),
    })
    return tags
  })

  async delete(id: number) {
    await db.delete(schema.tags).where(eq(schema.tags.id, id))
  }

  async deleteAll() {
    await db.delete(schema.tags)
  }

  async insertMany(tags: Tag[]) {
    await db.insert(schema.tags).values(tags)
  }

  async upsertBySlug(tag: Tag) {
    const [updated] = await db
      .insert(schema.tags)
      .values(tag)
      .onConflictDoUpdate({
        target: schema.posts.slug,
        set: tag,
      })
      .returning()

    return updated
  }
}
