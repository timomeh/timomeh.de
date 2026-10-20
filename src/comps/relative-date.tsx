'use client'

import { useEffect, useState } from 'react'

import { formatRelativeDate } from '@/lib/date'

export function RelativeDate({ date }: { date: Date }) {
  const [label, setLabel] = useState(() =>
    date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour12: false,
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Europe/Berlin',
    }),
  )

  useEffect(() => {
    const update = () => setLabel(formatRelativeDate(date))
    update()

    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [date])

  return label
}
