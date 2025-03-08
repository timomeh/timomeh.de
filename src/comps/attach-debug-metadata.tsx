'use client'

import { useLayoutEffect } from 'react'

type Props = {
  environment: string
  sampleRate: number
}

export function AttachDebugMetadata({ environment, sampleRate }: Props) {
  useLayoutEffect(() => {
    window.__timomeh ||= {}
    window.__timomeh.SENTRY_ENVIRONMENT = environment
    window.__timomeh.SENTRY_TRACES_SAMPLE_RATE = sampleRate
  }, [environment, sampleRate])

  return null
}
