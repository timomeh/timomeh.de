'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { JSX } from 'react'

type Props = Omit<LinkProps, 'href'> &
  JSX.IntrinsicElements['a'] & {
    sort: null | 'asc'
  }

export function ChangeSortLink({ sort, ...rest }: Props) {
  const pathname = usePathname()
  const base = pathname.replace(/\/asc\/?$/, '') || '/'

  return (
    <Link
      {...rest}
      href={sort === 'asc' ? `${base === '/' ? '' : base}/asc` : base}
    />
  )
}
