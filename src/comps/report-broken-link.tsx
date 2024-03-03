'use client'

import { usePathname } from 'next/navigation'

export function ReportBrokenLink() {
  const pathname = usePathname()

  const title = 'I found a broken link'
  const body = `I clicked on a link and landed on \`${pathname}\`, but it showed a 404.

This is where I clicked on: [please fill in some info where you clicked on which lead to the broken page]
`
  return (
    <a
      href={`https://github.com/timomeh/timomeh.de/discussions/new?category=ask-me&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`}
    >
      report on GitHub
    </a>
  )
}
