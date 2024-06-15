import { env } from '@/env'

// yo boy
// - Code block plugin?
// - email adapter foo
// - no data in dev database anymore whoops
// - better fields plugin for beta3? slugs and color fields now missing

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { buildConfig } from 'payload/config'
import { users } from './collections/users.collection'
import { posts } from './collections/posts.collection'
import { uploads } from './collections/uploads.collection'
import { categories } from './collections/categories.collection'
import { pages } from './collections/pages.collection'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    autoLogin: env.PAYLOAD_AUTO_LOGIN
      ? {
          email: 'test@example.com',
          password: 'test',
        }
      : false,
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  secret: env.PAYLOAD_SECRET,
  serverURL: env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [posts, pages, categories, uploads, users],
  cors: [env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins: [],
  sharp,
})
