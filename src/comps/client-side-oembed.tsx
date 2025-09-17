'use client'

import { useEffect, useState } from 'react'

type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLDivElement
>

export function ClientSideOembed(props: Props) {
  const [isClient, setClient] = useState(false)
  useEffect(() => setClient(true), [])
  if (!isClient) return null

  return (
    <div
      {...props}
      ref={(el) => {
        if (!el) return

        const checkIframeTheme = () => {
          if ('twttr' in window) {
            // biome-ignore lint/suspicious/noExplicitAny: twitter global
            ;(window.twttr as any)?.widgets.load()
          }

          const $iframe = el.querySelector('iframe')
          if ($iframe?.src?.includes('theme=')) {
            let siteTheme =
              document.documentElement.getAttribute('data-theme') || 'system'
            if (siteTheme === 'system') {
              const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)',
              ).matches
              siteTheme = prefersDark ? 'dark' : 'light'
            }

            if ($iframe.src.includes('theme=dark') && siteTheme === 'light') {
              $iframe.src = $iframe.src.replace('theme=dark', 'theme=light')
            }

            if ($iframe.src.includes('theme=light') && siteTheme === 'dark') {
              $iframe.src = $iframe.src.replace('theme=light', 'theme=dark')
            }
          }
        }

        const attrObserver = new MutationObserver(() => {
          checkIframeTheme()
        })

        const iframeObserver = new MutationObserver(() => {
          checkIframeTheme()
        })

        checkIframeTheme()
        iframeObserver.observe(el, { childList: true, subtree: true })
        attrObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        })

        return () => {
          iframeObserver.disconnect()
          attrObserver.disconnect()
        }
      }}
    />
  )
}
