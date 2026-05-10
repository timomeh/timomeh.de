'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// fix for view transitions messing with scroll to top when clicking a link

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
