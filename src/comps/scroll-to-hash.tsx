'use client'

import { useEffect } from 'react'

export function ScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ block: 'start' })
      if (
        document.activeElement === document.body ||
        document.activeElement === null
      ) {
        el.focus({ preventScroll: true })
      }
      return
    }

    const t = setTimeout(() => {
      if (document.getElementById(id)) return // real element arrived in time, skip
      document
        .getElementById('loading-anchor')
        ?.scrollIntoView({ block: 'start' })
    }, 400)
    return () => clearTimeout(t)
  }, [])

  return null
}
