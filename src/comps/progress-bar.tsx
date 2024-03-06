'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export function ProgressBar() {
  return (
    <AppProgressBar
      height="3px"
      color="blue"
      options={{ showSpinner: false }}
      shallowRouting
      delay={300}
    />
  )
}
