'use client'

import { useLayoutEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
}

export function ScrollAway({ children }: Props) {
  const $wrap = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrap = $wrap.current

    if (!wrap) return

    wrap.style.height = ''
    const rect = wrap.getBoundingClientRect()
    wrap.style.height = '0px'
    requestAnimationFrame(() => {
      if (!wrap) return
      wrap.style.height = ''

      window.scrollTo({
        top: window.scrollX + Math.ceil(rect.height),
        behavior: 'instant',
      })
    })

    return () => {
      if (!wrap) return

      const rect = wrap.getBoundingClientRect()
      window.scrollTo({
        top: window.scrollX - Math.ceil(rect.height),
        behavior: 'instant',
      })
    }
  }, [])

  return (
    <div ref={$wrap} style={{ height: 0 }} className="overflow-hidden">
      {children}
    </div>
  )
}
