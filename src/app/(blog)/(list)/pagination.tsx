import { CircleArrowLeft, CircleArrowRight } from 'lucide-react'
import Link from 'next/link'

import { GlassPill } from '@/comps/glass-pill'

type Props = {
  newerYear?: number
  olderYear?: number
  thisYear: number
  postCount: number
}

export function Pagination({
  newerYear,
  olderYear,
  thisYear,
  postCount,
}: Props) {
  return (
    <nav className="wrapper relative mb-6 flex items-center">
      {!!newerYear && (
        <Link
          href={
            newerYear === new Date().getFullYear() ? '/' : `/in/${newerYear}`
          }
          className="absolute right-full -mr-11 opacity-70 transition hover:-translate-x-1
            hover:opacity-100"
        >
          <GlassPill>
            <div className="flex items-center pr-5">
              <CircleArrowLeft className="mr-1.5 -ml-1.5 size-4 opacity-70" />
              <span>{newerYear}</span>
            </div>
          </GlassPill>
        </Link>
      )}
      <div className="relative z-10">
        <GlassPill>
          <h2>
            <em>
              {postCount} {postCount > 1 ? 'posts' : 'post'} in
            </em>{' '}
            <span>{thisYear}</span>
          </h2>
        </GlassPill>
      </div>
      {!!olderYear && (
        <Link
          href={`/in/${olderYear}`}
          className="absolute left-full -ml-11 opacity-70 transition hover:translate-x-1
            hover:opacity-100"
        >
          <GlassPill>
            <div className="flex items-center pl-5">
              <span>{olderYear}</span>
              <CircleArrowRight className="-mr-1.5 ml-1.5 size-4 opacity-70" />
            </div>
          </GlassPill>
        </Link>
      )}
    </nav>
  )
}
