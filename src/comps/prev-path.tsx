'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const PrevPathContext = createContext<string | null>(null)

type Props = {
  children: React.ReactNode
}

export function PrevPathProvider({ children }: Props) {
  const pathname = usePathname()
  const prevPathRef = useRef<string>(null)

  useEffect(() => {
    prevPathRef.current = pathname
  }, [pathname])

  return (
    <PrevPathContext.Provider value={prevPathRef.current}>
      {children}
    </PrevPathContext.Provider>
  )
}

export function usePrevPath() {
  return useContext(PrevPathContext)
}
