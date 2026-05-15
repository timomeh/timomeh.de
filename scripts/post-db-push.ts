import { createClient } from '@libsql/client'

const sql = `
CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
  title, content, search, tags,
  content='',
  tokenize="unicode61 remove_diacritics 2"
);
`

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:./data/db-data/blog.db',
  })

  await client.executeMultiple(sql)
  console.log('Post db:push succeeded')
}

main().catch((err) => {
  console.log('Post db:push failed')
  console.error(err)
  process.exit(1)
})
