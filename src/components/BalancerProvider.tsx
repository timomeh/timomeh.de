'use client'

import * as React from 'react'
import { Provider } from 'react-wrap-balancer'

type Props = {
  children: React.ReactNode
}

export function BalancerProvider({ children }: Props) {
  return <Provider>{children}</Provider>
}
