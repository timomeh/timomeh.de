import * as Sentry from '@sentry/nextjs'

declare global {
  interface Window {
    __timomeh?: {
      SENTRY_ENVIRONMENT?: string
      SENTRY_TRACES_SAMPLE_RATE?: number
    }
  }
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampler({ inheritOrSampleWith }) {
    return inheritOrSampleWith(
      Number(window.__timomeh?.SENTRY_TRACES_SAMPLE_RATE) || 0.5,
    )
  },
  beforeSend(event) {
    event.environment = window.__timomeh?.SENTRY_ENVIRONMENT || 'unknown'
    return event
  },
})
