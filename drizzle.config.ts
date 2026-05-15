import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  tablesFilter: ['!posts_fts*'],
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./data/db-data/blog.db',
  },
})
