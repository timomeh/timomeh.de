import { desc, eq, inArray, sql } from 'drizzle-orm'
import { Vla } from 'vla'

import { db, schema } from '@/db/client'
import { log as baseLog } from '@/lib/log'

type PostSearch = {
  id: number
  title: string
  content: string
  search: string | null
  postTags: {
    tag: {
      title: string
      search: string | null
    }
  }[]
}

const log = baseLog.child().withContext({ module: 'search/repo' })

export class PostsSearchRepo extends Vla.Repo {
  async list(query: string) {
    // split query into tokens (whitespace-separated)
    const tokens = query
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean)

    if (!tokens.length) return []

    // prefix match each token. `AND` them together
    // Example:
    //   search is:    foo bar
    //   query is:     foo:* & bar:*
    //   which means:  foo* AND bar*
    const ftsQuery = tokens.map((t) => `${t}:*`).join(' & ')
    const tsQuery = sql`to_tsquery('simple', ${ftsQuery})`
    const rank = sql<number>`ts_rank_cd(ARRAY[0.2, 0.4, 0.6, 1.0]::real[], ${schema.postsSearch.document}, ${tsQuery})`

    // table:   | title | content | search | tags |
    // weights: | 1.0   | 0.6     | 0.4    | 0.2 |

    const rows = await db
      .select({ id: schema.postsSearch.postId, rank })
      .from(schema.postsSearch)
      .where(sql`${schema.postsSearch.document} @@ ${tsQuery}`)
      .orderBy(desc(rank))
      .limit(40)

    return rows
  }

  async deleteById(id: number) {
    await db.delete(schema.postsSearch).where(eq(schema.postsSearch.postId, id))
  }

  async deleteByIds(ids: number[]) {
    if (!ids.length) return
    await db
      .delete(schema.postsSearch)
      .where(inArray(schema.postsSearch.postId, ids))
  }

  async deleteAll() {
    await db.delete(schema.postsSearch)
  }

  async insert(post: PostSearch) {
    const document = this.toDocument(post)

    await db
      .insert(schema.postsSearch)
      .values({ postId: post.id, document })
      .onConflictDoUpdate({
        target: schema.postsSearch.postId,
        set: { document },
      })
  }

  async insertMany(posts: PostSearch[]) {
    if (!posts.length) return

    const CHUNK_SIZE = 50
    for (let i = 0; i < posts.length; i += CHUNK_SIZE) {
      const chunk = posts.slice(i, i + CHUNK_SIZE)
      log.info(`Reindexing ${i + 1}-${i + chunk.length} of ${posts.length}`)
      const values = chunk.map((post) => ({
        postId: post.id,
        document: this.toDocument(post),
      }))

      await db
        .insert(schema.postsSearch)
        .values(values)
        .onConflictDoUpdate({
          target: schema.postsSearch.postId,
          set: { document: sql`excluded.document` },
        })
      log.info(`Done.`)
    }
  }

  private toDocument(post: PostSearch) {
    const search = [
      post.search ?? '',
      ...post.postTags.map(({ tag }) => tag.search ?? ''),
    ].join(' ')
    const tags = post.postTags.map(({ tag }) => tag.title).join(' ')

    return sql`
      setweight(to_tsvector('simple', ${post.title}), 'A') ||
      setweight(to_tsvector('simple', ${post.content}), 'B') ||
      setweight(to_tsvector('simple', ${search}), 'C') ||
      setweight(to_tsvector('simple', ${tags}), 'D')
    `
  }
}
