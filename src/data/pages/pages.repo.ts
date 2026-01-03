import { eq } from 'drizzle-orm'
import { Vla } from 'vla'
import { db, schema } from '../../db/client'
import type { Page } from '../cms'

export class PagesRepo extends Vla.Repo {
  listPublic = this.memo(async () => {
    const pages = await db.query.pages.findMany({
      where: (page, q) => q.eq(page.visibility, 'public'),
    })

    for (const page of pages) {
      this.bySlug.prime(page.slug).value(Promise.resolve(page))
    }

    return pages
  })

  bySlug = this.memo(async (slug: string) => {
    const page = await db.query.pages.findFirst({
      where: (page, q) => q.eq(page.slug, slug),
    })

    return page
  })

  async delete(id: number) {
    await db.delete(schema.pages).where(eq(schema.pages.id, id))
  }

  async deleteAll() {
    await db.delete(schema.pages)
  }

  async insertMany(pages: Page[]) {
    await db.insert(schema.pages).values(pages)
  }

  async upsertBySlug(page: Page) {
    const [updated] = await db
      .insert(schema.pages)
      .values(page)
      .onConflictDoUpdate({
        target: schema.pages.slug,
        set: page,
      })
      .returning()

    return updated
  }
}
