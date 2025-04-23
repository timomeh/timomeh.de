import { drizzle } from 'drizzle-orm/libsql'

import * as schema from '@/db/schema'

export const db = drizzle({
  connection: { url: 'file:./blog.db' },
  casing: 'snake_case',
  schema,
})

export { schema }
