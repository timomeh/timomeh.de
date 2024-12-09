'use client'

import { MoonIcon } from './icons/moon'
import { SunIcon } from './icons/sun'
import { MoonAutoIcon } from './icons/moon-auto'
import { SunAutoIcon } from './icons/sun-auto'

export function ThemeSwitcher() {
  return (
    <button
      title="Switch color mode"
      className="relative -m-1 block p-1 opacity-70 transition-opacity hover:opacity-100"
      value="light"
      type="button"
      onClick={() => {
        const currentTheme =
          document.documentElement.getAttribute('data-theme') || 'system'
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
        const prefersDarkOrder = ['system', 'light', 'dark']
        const prefersLightOrder = ['system', 'dark', 'light']
        const order = prefersDark ? prefersDarkOrder : prefersLightOrder

        const newTheme = order[(order.indexOf(currentTheme) + 1) % order.length]

        document.documentElement.setAttribute('data-theme', newTheme)

        if (newTheme !== 'system') {
          localStorage.setItem('theme', newTheme)
        } else {
          localStorage.removeItem('theme')
        }
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none relative -left-[10.5px] -top-[10.5px] size-3.5
          transition-transform"
      >
        <div
          className="absolute size-3.5 transition-[offset-distance] duration-1000
            [offset-path:path('M0_60C0_26_26_0_60_0')] [offset-rotate:auto_45deg]
            group-data-[theme=dark]/root:[offset-distance:30%]
            group-data-[theme=system]/root:[offset-distance:50%]
            group-data-[theme=light]/root:[offset-distance:70%]"
        >
          <div
            className="absolute left-0 top-0 size-3.5 opacity-0 transition-opacity duration-1000
              dark:group-data-[theme=system]/root:opacity-100"
          >
            <MoonAutoIcon />
          </div>
          <div
            className="absolute left-0 top-0 size-3.5 opacity-0 transition-opacity duration-1000
              group-data-[theme=system]/root:opacity-100
              dark:group-data-[theme=system]/root:!opacity-0"
          >
            <SunAutoIcon />
          </div>
        </div>
        <div
          className="absolute size-3.5 opacity-0 transition-[offset-distance,opacity] duration-1000
            [offset-distance:50%] [offset-path:path('M0_60C0_26_26_0_60_0')]
            [offset-rotate:auto_45deg] group-data-[theme=dark]/root:opacity-100
            group-data-[theme=light]/root:[offset-distance:30%]
            group-data-[theme=dark]/root:[offset-distance:50%]
            group-data-[theme=system]/root:[offset-distance:70%]"
        >
          <MoonIcon />
        </div>
        <div
          className="absolute size-3.5 opacity-0 transition-[offset-distance,opacity] duration-1000
            [offset-distance:50%] [offset-path:path('M0_60C0_26_26_0_60_0')]
            [offset-rotate:auto_45deg] group-data-[theme=light]/root:opacity-100
            group-data-[theme=system]/root:[offset-distance:30%]
            group-data-[theme=light]/root:[offset-distance:50%]
            group-data-[theme=dark]/root:[offset-distance:70%]"
        >
          <SunIcon />
        </div>
      </div>
    </button>
  )
}
