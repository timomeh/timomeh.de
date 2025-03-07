export const config = {
  siteUrl: process.env.SITE_URL!.split(',')[0],
  umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
  logLevel: process.env.LOG_LEVEL || 'warn',
  internalUrl: process.env.INTERNAL_URL || 'http://localhost:3000',
  api: {
    internalSecret: process.env.INTERNAL_SECRET!,
    nukeSecret: process.env.NUKE_SECRET!,
  },
  github: {
    contentPat: process.env.GITHUB_CONTENT_PAT!,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET!,
  },
  redis: {
    url: process.env.REDIS_DB_URL,
  },
}
