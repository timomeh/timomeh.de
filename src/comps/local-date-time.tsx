'use client'

import { useEffect, useState } from 'react'

type Props = {
  utc: string
}

export function LocalDateTime({ utc }: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <span key={isClient ? 'client' : 'server'}>
      <span suppressHydrationWarning={true}>
        {new Date(utc).toLocaleString(undefined, {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short',
        })}
      </span>
    </span>
  )
}
