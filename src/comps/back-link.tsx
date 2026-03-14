'use client'

import Link, { type LinkProps } from 'next/link'
import type { JSX } from 'react'

import { usePrevPath } from './prev-path'

type Props = Omit<LinkProps, 'href'> & JSX.IntrinsicElements['a']

export function BackLink({ ...rest }: Props) {
  const prevPath = usePrevPath()

  // oxlint-disable-next-line jsx_a11y/anchor-has-content
  return <Link {...rest} href={prevPath || '/'} />
}
