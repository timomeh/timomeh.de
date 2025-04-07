'use client'

import { usePathname } from 'next/navigation'
import { unstable_ViewTransition as ViewTransition } from 'react'

type Props = {
  children: React.ReactNode
  name: string
}

export function ConditionalViewTransition({ children, name }: Props) {
  const pathname = usePathname()

  return (
    <ViewTransition
      key={name}
      name={name}
      onShare={(instance) => {
        // Only animate posts when navigating between a single post and a post list.
        // To prevent posts from flying all over the screen when navigating between
        // lists.
        const shouldAnimate =
          location.pathname.startsWith('/posts/') ||
          pathname.startsWith('/posts/')

        if (!shouldAnimate) {
          instance.group.getAnimations().forEach((anim) => anim.finish())
          instance.new.getAnimations().forEach((anim) => anim.finish())
          instance.old.getAnimations().forEach((anim) => anim.finish())
        }
      }}
    >
      {children}
    </ViewTransition>
  )
}
