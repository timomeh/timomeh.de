import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'

export const db = drizzle({
  connection: { url: 'file:./data/db-data/blog.db' },
  casing: 'snake_case',
  schema,
})

export { schema }
