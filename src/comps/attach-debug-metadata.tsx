'use client'

import { useLayoutEffect } from 'react'

type Props = {
  environment: string
}

export function AttachDebugMetadata({ environment }: Props) {
  useLayoutEffect(() => {
    window.__timomeh ||= {}
    window.__timomeh.SENTRY_ENVIRONMENT = environment
  }, [environment])

  return null
}
