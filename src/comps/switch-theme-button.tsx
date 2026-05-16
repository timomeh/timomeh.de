'use client'

import type { JSX } from 'react'

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
          setThemeColor(newTheme)
        } else {
          localStorage.removeItem('theme')
          resetThemeColor()
        }
      }}
      {...props}
    />
  )
}

function setThemeColor(theme: string) {
  const color = theme === 'light' ? '#E8E7E4' : '#0D0D0B'

  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((el) => el.remove())
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = color
  document.head.appendChild(meta)
}

function resetThemeColor() {
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((el) => el.remove())

  const light = Object.assign(document.createElement('meta'), {
    name: 'theme-color',
    content: '#E8E7E4',
  })
  light.setAttribute('media', '(prefers-color-scheme: light)')

  const dark = Object.assign(document.createElement('meta'), {
    name: 'theme-color',
    content: '#0D0D0B',
  })
  dark.setAttribute('media', '(prefers-color-scheme: dark)')

  document.head.append(light, dark)
}
