import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical' // editor-import
import { loadEnvConfig } from '@next/env'
import redirects from '@payloadcms/plugin-redirects'
import path from 'path'
import { buildConfig } from 'payload/config'

console.log(process.cwd())

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

export default buildConfig({
  admin: {
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@next/env': path.resolve(__dirname, './next-env-stub.js'),
        },
      },
    }),
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins: [
    redirects({
      collections: [],
    }),
  ],
})
