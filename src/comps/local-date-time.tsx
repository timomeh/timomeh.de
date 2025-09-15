'use client'

import { useEffect, useState } from 'react'

type Props = {
  utc: string
  showDate?: boolean
  showTime?: boolean
}

export function LocalDateTime({
  utc,
  showDate = true,
  showTime = true,
}: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <span key={isClient ? 'client' : 'server'}>
      {showDate && (
        <span suppressHydrationWarning={true}>
          {new Date(utc).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
      )}
      {showDate && showTime && <span className="mx-1">·</span>}
      {showTime && (
        <span suppressHydrationWarning={true}>
          {new Date(utc).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
          })}
        </span>
      )}
    </span>
  )
}
