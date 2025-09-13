'use client'

import Link, { type LinkProps } from 'next/link'
import type { JSX } from 'react'

import { usePrevPath } from './prev-path'

type Props = Omit<LinkProps, 'href'> & JSX.IntrinsicElements['a']

export function BackLink({ ...rest }: Props) {
  const prevPath = usePrevPath()

  return <Link {...rest} href={prevPath || '/'} />
}
