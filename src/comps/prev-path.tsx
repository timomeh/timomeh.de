'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'

const PrevPathContext = createContext<string | null>(null)

type Props = {
  children: React.ReactNode
}

export function PrevPathProvider({ children }: Props) {
  const layoutSegments = useSelectedLayoutSegments()
  const prevPathRef = useRef<string>(null)

  useEffect(() => {
    if (layoutSegments[0] === '(list)' || layoutSegments[0] === 'archive') {
      prevPathRef.current = layoutSegments.join('/')
    }
  }, [layoutSegments])

  return (
    <PrevPathContext.Provider value={prevPathRef.current}>
      {children}
    </PrevPathContext.Provider>
  )
}

export function usePrevPath() {
  return useContext(PrevPathContext)
}
