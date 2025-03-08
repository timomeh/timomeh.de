import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export function useCaptureException(error: any) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])
}
