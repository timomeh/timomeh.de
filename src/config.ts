/** biome-ignore-all lint/style/noNonNullAssertion: would be nice to use zod here */
import 'server-only'

export const config = {
  siteUrl: process.env.SITE_URL!.split(',')[0],
  umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
  umamiUrl: process.env.UMAMI_URL,
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
  buckets: {
    generatedImages: {
      region: process.env.AWS_DEFAULT_REGION!,
      endpoint: process.env.AWS_ENDPOINT_URL!,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      bucket: process.env.AWS_S3_BUCKET_NAME!,
    },
  },
}
