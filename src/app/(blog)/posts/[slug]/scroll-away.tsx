'use client'

import { useLayoutEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
}

export function ScrollAway({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!ref.current) return

    ref.current.style.height = ''
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.height = '0px'
    requestAnimationFrame(() => {
      if (!ref.current) return
      ref.current.style.height = ''

      window.scrollTo({
        top: window.scrollX + rect.height,
        behavior: 'instant',
      })
    })
  }, [])

  return (
    <div ref={ref} style={{ height: 0 }} className="overflow-hidden">
      {children}
    </div>
  )
}
