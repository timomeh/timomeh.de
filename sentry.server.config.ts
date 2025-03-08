import * as Sentry from '@sentry/nextjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.5),
  profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE || 0.5),
  environment: process.env.SENTRY_ENVIRONMENT,
})
