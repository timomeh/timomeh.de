import { drizzle } from 'drizzle-orm/libsql'

import * as schema from '@/db/schema'
import { env } from '@/lib/env'

export const db = drizzle({
  connection: { url: env.DB_FILE_NAME },
  casing: 'snake_case',
  schema,
})

export { schema }
