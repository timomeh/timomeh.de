'use client'

import { useLayoutEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
}

export function ScrollAway({ children }: Props) {
  const $wrap = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!$wrap.current) return

    $wrap.current.style.height = ''
    const rect = $wrap.current.getBoundingClientRect()
    $wrap.current.style.height = '0px'
    requestAnimationFrame(() => {
      if (!$wrap.current) return
      $wrap.current.style.height = ''

      console.log('lol!')

      window.scrollTo({
        top: window.scrollX + rect.height,
        behavior: 'instant',
      })
    })
  }, [])

  return (
    <div ref={$wrap} style={{ height: 0 }} className="overflow-hidden">
      {children}
    </div>
  )
}
