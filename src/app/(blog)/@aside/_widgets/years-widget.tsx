import Link from 'next/link'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { listPostYears } from '@/data/posts'

type Props = {
  yearParam?: string
  tagParam?: string
  sortParam?: string | string[]
}

export async function YearsWidget({ yearParam, sortParam, tagParam }: Props) {
  const postYears = await listPostYears()
  const activeSort = sortParam?.toString() === 'asc' ? 'asc' : null
  const activeYear = yearParam
    ? Number(yearParam)
    : tagParam
      ? null
      : postYears[0].year

  return (
    <div className="@max-5xs:grid-cols-1 grid grid-cols-2 gap-1">
      {postYears.map((postYear) => (
        <Link
          key={postYear.year}
          href={{
            pathname:
              postYear.year === new Date().getFullYear()
                ? '/'
                : `/in/${postYear.year}`,
            query: activeSort ? { sort: activeSort } : {},
          }}
          className="group/btn relative block"
          data-current={postYear.year === activeYear}
        >
          <div
            className="rounded-md border border-transparent text-gray-900/80 transition
              group-hover/btn:border-gray-900/10 group-hover/btn:bg-gray-900/5
              group-hover/btn:text-gray-900 in-data-[current=true]:!border-transparent
              in-data-[current=true]:!bg-transparent dark:text-white/80
              dark:group-hover/btn:border-white/10 dark:group-hover/btn:bg-white/5
              dark:group-hover/btn:text-white"
          >
            {postYear.year === activeYear && (
              <ViewTransition name="active-year-bg">
                <div className="absolute inset-0 rounded-md border border-emerald-600/70 bg-emerald-600/20" />
              </ViewTransition>
            )}
            <div
              className="@max-5xs:p-1 @max-5xs:flex-row flex flex-col items-center justify-center p-2
                in-data-[current=true]:text-emerald-900
                dark:in-data-[current=true]:text-emerald-50"
            >
              <div className="@max-5xs:text-xs font-mono text-sm font-medium">
                {postYear.year}
              </div>
              <div className="@max-5xs:sr-only text-xs font-medium">
                {postYear.count} posts
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
