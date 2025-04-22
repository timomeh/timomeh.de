import '@next/env'

import { defineConfig } from 'drizzle-kit'

import { env } from './src/lib/env'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
})
