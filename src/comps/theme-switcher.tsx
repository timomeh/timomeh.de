'use client'

import { useLayoutEffect, useState } from 'react'
import { MoonIcon } from './icons/moon'
import { SunIcon } from './icons/sun'

export function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | null>(null)

  useLayoutEffect(() => {
    const theme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    setActiveTheme(theme)
  }, [])

  return (
    <button
      title="Switch color mode"
      className="relative -ml-px block size-4 opacity-70 transition-opacity hover:opacity-100"
      value="light"
      type="button"
      onClick={() => {
        const theme = localStorage.getItem('theme') || 'dark'
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
        setActiveTheme(newTheme)
      }}
    >
      <div
        aria-hidden
        aria-selected={activeTheme === 'dark'}
        className="absolute left-0 top-0 m-px size-3.5 -translate-y-full opacity-0 transition-all
          duration-300 aria-selected:translate-y-0 aria-selected:opacity-100"
      >
        <MoonIcon />
      </div>
      <div
        aria-hidden
        className="absolute left-0 top-0 h-4 w-4 translate-y-full opacity-0 transition-all
          duration-300 aria-selected:translate-y-0 aria-selected:opacity-100"
        aria-selected={activeTheme === 'light'}
      >
        <SunIcon />
      </div>
    </button>
  )
}
