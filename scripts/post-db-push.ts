import { createClient } from '@libsql/client'

const createFTS5Sql = `
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title, content, search, tags,
  content='',
  contentless_delete=1,
  tokenize="unicode61 remove_diacritics 2"
);
`

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:./data/db-data/blog.db',
  })

  // FTS5 options can't be altered; so if necessary, drop and recreate
  const existing = await client.execute({
    sql: `SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'posts_fts'`,
    args: [],
  })
  const existingSql = (existing.rows[0]?.sql as string | undefined) ?? ''
  if (existingSql && !/contentless_delete\s*=\s*1/i.test(existingSql)) {
    console.log('Recreating posts_fts to enable contentless_delete')
    await client.execute('DROP TABLE posts_fts')
  }

  await client.executeMultiple(createFTS5Sql)
  console.log('Post db:push succeeded')
}

main().catch((err) => {
  console.log('Post db:push failed')
  console.error(err)
  process.exit(1)
})
