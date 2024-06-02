import { env } from '@/env'

import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload/config'
import { users } from './collections/users.collection'
import { posts } from './collections/posts.collection'
import { uploads } from './collections/uploads.collection'
import { categories } from './collections/categories.collection'
import { pages } from './collections/pages.collection'

export default buildConfig({
  admin: {
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@/env': path.resolve(__dirname, './env-stub.js'),
        },
        // it's a mess that this is shared between the client and server, wtf
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          os: false,
          util: false,
        },
      },
    }),
    autoLogin:
      process.env.PAYLOAD_PUBLIC_ENABLE_AUTOLOGIN === 'true'
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
    migrationDir: path.resolve(__dirname, 'migrations'),
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  serverURL: env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [posts, pages, categories, uploads, users],
  cors: [env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins: [],
})
