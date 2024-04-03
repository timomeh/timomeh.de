'use client'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { useEffect, useState } from 'react'

export function Analyze() {
  const [shouldRender, setShouldRender] = useState(false)

  // Only initialize client-side analytics if it's not my bot

  useEffect(() => {
    if (window.navigator.userAgent.includes('timomeh.de-wake')) {
      return
    }

    setShouldRender(true)
  }, [])

  if (!shouldRender) {
    return null
  }

  return <SpeedInsights />
}
