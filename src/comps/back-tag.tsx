'use client'

import { usePrevPath } from './prev-path'
import { Tag } from './tag'
import { TagLink } from './tag-link'

export function BackTag() {
  const prevPath = usePrevPath()

  let backPath = '/'

  if (prevPath?.startsWith('(list)')) {
    backPath = prevPath.replace('(list)', '')
  }
  if (prevPath === 'archive') {
    backPath = '/'.concat(prevPath)
  }

  return (
    <TagLink href={backPath || '/'}>
      <span className="text-[#ba7fdb] dark:text-[#DEC1EF]">
        <Tag
          color="currentColor"
          title={
            <>
              <span className="hidden dark:inline">←</span>
              <span className="dark:hidden">&lt;</span> Back
            </>
          }
        />
      </span>
    </TagLink>
  )
}
