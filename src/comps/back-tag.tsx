import Link from 'next/link'

import { Tag } from './tag'

export function BackTag() {
  return (
    <Link
      href="/"
      className="ease-linear [transition:opacity_300ms,transform_60ms] hover:!opacity-100
        motion-safe:active:scale-[.97]"
    >
      <Tag color="#DEC1EF" clickable name="← Back" />
    </Link>
  )
}
