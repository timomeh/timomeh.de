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
      data-current={pathname.split('page/')[0] === rest.href}
      data-dim-current={dim}
      className="group/tag-link relative rounded-full ease-linear
        [transition:opacity_300ms,transform_60ms] hover:!opacity-100
        data-[current=false]:data-[dim-current=true]:opacity-70
        focus-visible:data-[current=false]:data-[dim-current=true]:opacity-80
        data-[dim-current=true]:data-[current=false]:group-hover/tags:opacity-80
        motion-safe:active:scale-[.97] dark:backdrop-brightness-50"
      {...rest}
    />
  )
}
