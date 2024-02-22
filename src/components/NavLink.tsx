'use client'

import Link from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import clsx from 'clsx'

type Props = {
  children: React.ReactNode
  segment: string
  href: string
  backDot?: boolean
}

export function NavLink({ children, segment, href, backDot }: Props) {
  const segments = useSelectedLayoutSegments()
  const isActive = segments[0] === segment

  return (
    <Link
      href={href}
      className="flex py-1 items-center relative justify-center uppercase text-sm leading-none tracking-wide font-display font-bold"
    >
      <div
        className={clsx(
          isActive ? 'opacity-100' : 'opacity-50',
          'hover:opacity-80 transition-opacity'
        )}
      >
        {children}
      </div>
    </Link>
  )
}
