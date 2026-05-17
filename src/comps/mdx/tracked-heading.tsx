'use client'

import { useEffect, useRef } from 'react'

import { useRegisterHeading } from './active-heading-context'

type Level = 1 | 2 | 3 | 4 | 5 | 6

type Props = React.ComponentPropsWithoutRef<'h2'> & {
  level: Level
}

export function TrackedHeading({ level, children, ...rest }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)
  const register = useRegisterHeading()

  useEffect(() => {
    if (!ref.current || !register) return

    const text = ref.current.textContent ?? ''
    if (!text) return

    return register({ text, element: ref.current })
  }, [register, children])

  const Tag = `h${level}` as 'h2'
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
