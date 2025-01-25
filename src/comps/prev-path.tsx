'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

const PrevPathContext = createContext<string | null>(null)

type Props = {
  children: React.ReactNode
}

export function PrevPathProvider({ children }: Props) {
  const layoutSegments = useSelectedLayoutSegments()
  const [prevPath, setPrevPath] = useState<string | null>(() => {
    if (layoutSegments[0] === '(list)' || layoutSegments[0] === 'archive') {
      return layoutSegments.join('/')
    }

    return null
  })

  useEffect(() => {
    if (layoutSegments[0] === '(list)' || layoutSegments[0] === 'archive') {
      setPrevPath(layoutSegments.join('/'))
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
