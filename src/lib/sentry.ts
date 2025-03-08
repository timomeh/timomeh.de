import 'server-only'

import * as Sentry from '@sentry/nextjs'

type CaptureOpts = {
  level?: 'fatal' | 'error' | 'warning'
}

export function captureException(error: any, opts: CaptureOpts = {}) {
  Sentry.captureException(error, {
    level: opts.level || 'error',
  })
}
