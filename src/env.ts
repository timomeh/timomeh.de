import { z } from 'zod'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production')

const envSchema = z.object({
  /** Server port */
  PORT: z.coerce.number().default(3000),

  /** Used by payload for encryption stuff */
  PAYLOAD_SECRET: z.string(),

  /** Postgres connection string */
  DATABASE_URI: z.string(),

  /** Base URL the server is running on */
  PAYLOAD_PUBLIC_SERVER_URL: z.string().url(),

  /** URL under which images are served. @see https://payloadcms.com/docs/upload/overview#collection-upload-options */
  PAYLOAD_UPLOADS_URL: z.string(),

  /** Local dir where images will be stored. @see https://payloadcms.com/docs/upload/overview#collection-upload-options */
  PAYLOAD_UPLOADS_DIR: z.string(),

  /** deez nuts */
  NODE_ENV: z
    .union([
      z.literal('development'),
      z.literal('test'),
      z.literal('production'),
    ])
    .default('development'),
})

export const env = envSchema.parse(process.env)
