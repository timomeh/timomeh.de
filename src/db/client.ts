import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL || 'file:./data/db-data/blog.db',
  },
  casing: 'snake_case',
  schema,
})

export { schema }
