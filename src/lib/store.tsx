'use client'

import { createStore, Provider } from 'jotai'
import * as React from 'react'

export const store = createStore()

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
