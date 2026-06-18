import { invariant } from '@/lib/invariant'

const isoEnv =
  typeof window === 'undefined' ? process.env : globalThis.__timomeh_env!

export const env = {
  // server-only
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  GITHUB_CONTENT_PAT: process.env.GITHUB_CONTENT_PAT,
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
  INTERNAL_SECRET: process.env.INTERNAL_SECRET,
  NUKE_SECRET: process.env.NUKE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,

  // for testing, anything that's random but needs to be stable in tests
  RANDOM_SEED: process.env.RANDOM_SEED
    ? Number(process.env.RANDOM_SEED)
    : undefined,

  // only required by keystatic. here for documentation purposes
  KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
  NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG:
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,

  // server + client
  CONTENT_PROXY_PRIVATE_URL: isoEnv.CONTENT_PROXY_PRIVATE_URL,
  IMAGE_PROXY_PUBLIC_URL: isoEnv.IMAGE_PROXY_PUBLIC_URL,
  IMAGE_PROXY_PRIVATE_URL: isoEnv.IMAGE_PROXY_PRIVATE_URL,
  SITE_PUBLIC_URL: isoEnv.SITE_PUBLIC_URL,
  SITE_PRIVATE_URL: isoEnv.SITE_PRIVATE_URL,
  UMAMI_PUBLIC_URL: isoEnv.UMAMI_PUBLIC_URL,
  UMAMI_WEBSITE_ID: isoEnv.UMAMI_WEBSITE_ID,
  CMS_REPO: isoEnv.CMS_REPO, // owner/repo format
}

export type Env = typeof env

export function getEnv<K extends keyof Env>(name: K) {
  const value = env[name]
  invariant(value != null, `Environment variable ${name} is missing`)
  return value as Exclude<Env[K], undefined>
}

declare global {
  var __timomeh_env: Record<string, string | undefined> | undefined
}
