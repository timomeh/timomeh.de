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
        className="group/tag-link relative rounded-full text-[#ba7fdb] ease-linear
          [transition:opacity_300ms,transform_60ms] hover:!opacity-100
          data-[current=false]:data-[dim-current=true]:opacity-75
          motion-safe:active:scale-[.97] dark:text-[#DEC1EF] dark:backdrop-brightness-50"
        type="button"
        onClick={() => router.back()}
        data-umami-event="Back button"
        data-umami-event-type="history"
      >
        <Tag
          color="currentColor"
          title={
            <>
              <span className="hidden dark:inline">←</span>
              <span className="dark:hidden">
                &lt;
              </span> Back
            </>
          }
        />
      </button>
    )
  }
  return (
    <TagLink
      href="/"
      data-umami-event="Back button"
      data-umami-event-type="static"
    >
      <span className="text-[#ba7fdb] dark:text-[#DEC1EF]">
        <Tag
          color="currentColor"
          title={
            <>
              <span className="hidden dark:inline">←</span>
              <span className="dark:hidden">
                &lt;
              </span> Back
            </>
          }
        />
      </span>
    </TagLink>
  )
}
