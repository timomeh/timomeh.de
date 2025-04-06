'use client'

import { CircleArrowDown } from 'lucide-react'

import { Card } from '../../../comps/card'

type Props = {
  slug: string
}

export function JumpToPost({ slug }: Props) {
  return (
    <a
      href={`#${slug}`}
      className="group/jumper w-full max-w-[720px]"
      onClick={(e) => {
        e.preventDefault()
        const el = document.getElementById(slug)
        el?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      <Card>
        <div className="absolute inset-0 bg-orange-300/20 dark:bg-purple-600/5" />
        <div
          className="font-display wrapper flex items-center justify-center px-4 py-4 text-center
            text-lg font-medium text-orange-800 underline sm:px-6 sm:py-6
            dark:text-purple-300"
        >
          <CircleArrowDown
            className="absolute -right-14 size-32 opacity-10 motion-safe:mt-10
              motion-safe:animate-bounce motion-safe:[animation-duration:3s] sm:opacity-30"
          />
          Jump to the post where you left off
        </div>
      </Card>
    </a>
  )
}
