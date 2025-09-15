'use client'

import { Fancybox } from '@fancyapps/ui/dist/fancybox/'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

type Props = {
  children: React.ReactNode
}

export function Lightbox({ children }: Props) {
  return (
    <div
      ref={(el) => {
        if (!el) return

        Fancybox.bind(el, '[data-fancybox]', {
          closeButton: true,
          Carousel: {
            infinite: false,

            Toolbar: {
              display: {
                right: [],
              },
            },
          },
        })

        return () => {
          Fancybox.unbind(el)
        }
      }}
    >
      {children}
    </div>
  )
}
