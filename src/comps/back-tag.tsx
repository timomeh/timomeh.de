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
        className="group/tag-link ease-linear [transition:opacity_300ms,transform_60ms]
          hover:!opacity-100 data-[current=false]:data-[dim-current=true]:opacity-75
          motion-safe:active:scale-[.97]"
        type="button"
        onClick={() => router.back()}
      >
        <Tag color="#DEC1EF" title="← Back" />
      </button>
    )
  }
  return (
    <TagLink href="/">
      <Tag color="#DEC1EF" title="← Back" />
    </TagLink>
  )
}
