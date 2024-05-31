'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  children: React.ReactNode
  dim?: boolean
} & LinkProps

export function TagLink({ dim, ...rest }: Props) {
  const pathname = usePathname()

  return (
    <Link
      data-current={pathname === rest.href}
      data-dim-current={dim}
      className="group/tag-link ease-linear [transition:opacity_300ms,transform_60ms]
        hover:!opacity-100 data-[current=false]:data-[dim-current=true]:opacity-75
        motion-safe:active:scale-[.97]"
      {...rest}
    />
  )
}
