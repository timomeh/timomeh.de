import * as Sentry from '@sentry/nextjs'

declare global {
  interface Window {
    __timomeh?: {
      SENTRY_ENVIRONMENT?: string
    }
  }
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  beforeSend(event) {
    event.environment = window.__timomeh?.SENTRY_ENVIRONMENT || 'unknown'
    return event
  },
})
