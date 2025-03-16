'use client'

import { useEffect, useState } from 'react'

type Props = {
  slug: string
  children: React.ReactNode
}

// css :target doesn't work with pushState()

export function AppearForFragment({ slug, children }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(window.location.hash === '#' + slug)
  }, [slug])

  return (
    <div
      ref={($el) => {
        if (!$el) return

        let timeoutId: NodeJS.Timeout | undefined

        $el.addEventListener('click', (event) => {
          if (event.target instanceof HTMLElement) {
            const link = event.target.closest('a')
            if (link) {
              timeoutId = setTimeout(() => {
                setVisible(window.location.hash === '#' + slug)
              }, 1000)
            }
          }
        })

        return () => {
          clearTimeout(timeoutId)
        }
      }}
      data-visible={visible}
      className="invisible block h-0 opacity-0 transition-all delay-200 duration-500
        data-[visible=true]:visible data-[visible=true]:h-auto
        data-[visible=true]:opacity-100"
    >
      {children}
    </div>
  )
}
