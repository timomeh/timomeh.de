'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { createContext, Suspense, useContext, useEffect, useState } from 'react'

const PrevPathContext = createContext<string | null>(null)

type Props = {
  children: React.ReactNode
}

export function PrevPathProvider({ children }: Props) {
  return (
    <Suspense
      fallback={
        <PrevPathContext.Provider value={null}>
          {children}
        </PrevPathContext.Provider>
      }
    >
      <PrevPathTracker>{children}</PrevPathTracker>
    </Suspense>
  )
}

function PrevPathTracker({ children }: Props) {
  const layoutSegments = useSelectedLayoutSegments()
  const [prevPath, setPrevPath] = useState<string | null>(() => {
    if (layoutSegments[0] === '(list)' && typeof window !== 'undefined') {
      return location.pathname + location.search
    }

    return null
  })

  useEffect(() => {
    if (layoutSegments[0] === '(list)') {
      setPrevPath(location.pathname + location.search)
    }
  }, [layoutSegments])

  return (
    <PrevPathContext.Provider value={prevPath}>
      {children}
    </PrevPathContext.Provider>
  )
}

export function usePrevPath() {
  return useContext(PrevPathContext)
}
