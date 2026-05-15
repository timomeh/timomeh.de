import { sql } from 'drizzle-orm'
import { Vla } from 'vla'

import { db } from '@/db/client'

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

export class PostsSearchRepo extends Vla.Repo {
  async list(query: string) {
    // split query into tokens (whitespace-separated)
    const tokens = query
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // strip FTS5 syntax from string
      .split(/\s+/)
      .filter(Boolean)

    if (!tokens.length) return []

    // prefix match each token. `AND` them together
    // Example:
    //   search is:    foo bar
    //   query is:     foo* bar*
    //   which means:  foo* AND bar*
    const ftsQuery = tokens.map((t) => `${t}*`).join(' ')

    // table:   | title | content | search | tags |
    // scores:  | 5.0   | 3.0     | 2.0    | 1.0 |

    const rows = await db.all<{ id: number; rank: number }>(sql`
      SELECT rowid AS id, bm25(posts_fts, 5.0, 3.0, 2.0, 1.0) AS rank
      FROM posts_fts
      WHERE posts_fts MATCH ${ftsQuery}
      ORDER BY rank
      LIMIT 40
    `)

    return rows
  }

  async deleteById(id: number) {
    await db.run(sql`DELETE FROM posts_fts WHERE rowid = ${id}`)
  }

  async deleteAll() {
    await db.run(sql`INSERT INTO posts_fts(posts_fts) VALUES('delete-all')`)
  }

  async insert(post: PostSearch) {
    const { search, tags } = this.toRow(post)

    await db.run(sql`
      INSERT INTO posts_fts (rowid, title, content, search, tags)
      VALUES (${post.id}, ${post.title}, ${post.content}, ${search}, ${tags})
    `)
  }

  async insertMany(posts: PostSearch[]) {
    if (!posts.length) return

    const CHUNK_SIZE = 50
    for (let i = 0; i < posts.length; i += CHUNK_SIZE) {
      const chunk = posts.slice(i, i + CHUNK_SIZE)
      const values = sql.join(
        chunk.map((post) => {
          const { search, tags } = this.toRow(post)
          return sql`(${post.id}, ${post.title}, ${post.content}, ${search}, ${tags})`
        }),
        sql`, `,
      )

      await db.run(sql`
        INSERT INTO posts_fts (rowid, title, content, search, tags)
        VALUES ${values}
      `)
    }
  }

  private toRow(post: PostSearch) {
    const search = [
      post.search ?? '',
      post.postTags.map(({ tag }) => tag.search ?? ''),
    ].join(' ')
    const tags = post.postTags.map(({ tag }) => tag.title).join(' ')
    return { search, tags }
  }
}
