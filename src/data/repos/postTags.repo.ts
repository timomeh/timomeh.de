import { eq } from 'drizzle-orm'
import { Vla } from 'vla'
import { db, schema } from '../../db/client'

type PostTag = {
  postId: number
  tagId: number
}

export class PostTagsRepo extends Vla.Repo {
  async deleteAll() {
    await db.delete(schema.postTags)
  }

  async deleteByPost(id: number) {
    await db.delete(schema.postTags).where(eq(schema.postTags.postId, id))
  }

  async insertMany(postTags: PostTag[]) {
    return db.insert(schema.postTags).values(postTags).returning()
  }
}
