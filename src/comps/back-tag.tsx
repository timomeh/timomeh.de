'use client'

import { useRouter } from 'next/navigation'
import { usePrevPath } from './prev-path'
import { Tag } from './tag'
import { TagLink } from './tag-link'

export function BackTag() {
  const prevPath = usePrevPath()
  const router = useRouter()

  if (prevPath) {
    return (
      <button
        className="group/tag-link relative ease-linear [transition:opacity_300ms,transform_60ms]
          hover:!opacity-100 data-[current=false]:data-[dim-current=true]:opacity-75
          motion-safe:active:scale-[.97]"
        type="button"
        onClick={() => router.back()}
        data-umami-event="Back button"
        data-umami-event-type="history"
      >
        <Tag color="#DEC1EF" title="← Back" />
        <div className="absolute inset-0 z-[-1] rounded-full bg-black/50" />
      </button>
    )
  }
  return (
    <TagLink
      href="/"
      data-umami-event="Back button"
      data-umami-event-type="static"
    >
      <Tag color="#DEC1EF" title="← Back" />
    </TagLink>
  )
}
