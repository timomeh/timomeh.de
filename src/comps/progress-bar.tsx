'use client'

import { ProgressProvider } from '@bprogress/next/app'

type Props = {
  children: React.ReactNode
}

export function ProgressBarProvider({ children }: Props) {
  return (
    <ProgressProvider
      height="3px"
      color="blue"
      options={{ showSpinner: false }}
      shallowRouting
      delay={300}
    >
      {children}
    </ProgressProvider>
  )
}
