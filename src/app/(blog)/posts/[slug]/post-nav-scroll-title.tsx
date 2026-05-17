'use client'

import { useEffect, useRef, useState } from 'react'

import { useActiveHeading } from '@/comps/mdx/active-heading-context'

type Entry = { id: number; text: string; leaving: boolean }

const DURATION_MS = 500

export function PostNavScrollTitle() {
  const active = useActiveHeading()
  const [entries, setEntries] = useState<Entry[]>([])
  const idRef = useRef(0)
  const lastTextRef = useRef<string | null>(null)

  useEffect(() => {
    if (active === lastTextRef.current) return
    lastTextRef.current = active

    setEntries((curr) => {
      const next = curr.map((e) => ({ ...e, leaving: true }))
      if (active) {
        next.push({ id: ++idRef.current, text: active, leaving: false })
      }
      return next
    })

    setTimeout(() => {
      setEntries((curr) => curr.filter((e) => !e.leaving))
    }, DURATION_MS + 50)
  }, [active])

  if (entries.length === 0) return null

  const visibleText =
    entries.findLast((e) => !e.leaving)?.text ??
    entries[entries.length - 1].text

  return (
    <div className="relative mr-4 h-10 font-semibold md:mr-6">
      <span className="invisible">{visibleText}</span>
      {entries.map((e) => (
        <span
          key={e.id}
          data-leaving={e.leaving}
          className="
            absolute inset-0
            inline-flex translate-0
            items-center opacity-100
            transition-all duration-500
            data-[leaving=true]:translate-y-2 data-[leaving=true]:opacity-0
            starting:-translate-y-2 starting:opacity-0
          "
        >
          <span className="line-clamp-1">{e.text}</span>
        </span>
      ))}
    </div>
  )
}
