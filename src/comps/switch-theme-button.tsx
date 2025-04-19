'use client'

import { JSX } from 'react'

type Props = JSX.IntrinsicElements['button']

export function SwitchThemeButton(props: Props) {
  return (
    <button
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
      {...props}
    />
  )
}
