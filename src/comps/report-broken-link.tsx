'use client'

import { usePathname } from 'next/navigation'

export function ReportBrokenLink() {
  const pathname = usePathname()

  const title = 'I found a broken link'
  const body = `I clicked on a link and landed on \`${pathname}\`, but it showed a 404.

This is where I clicked on: [please fill in some info where you clicked on which lead to the broken page]
`
  return <Report title={title} body={body} text="report on GitHub" />
}

export function ReportBrokenPage() {
  const pathname = usePathname()

  const title = 'I found a broken page'
  const body = `I was on \`${pathname}\` and it showed a 500.`

  return <Report title={title} body={body} text="report on GitHub" />
}

type Props = {
  title: string
  body: string
  text: string
}

function Report({ title, body, text }: Props) {
  return (
    <a
      href={`https://github.com/timomeh/timomeh.de/discussions/new?category=ask-me&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`}
    >
      {text}
    </a>
  )
}
