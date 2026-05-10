import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { GetPostYearsNav } from './data'

export async function PostYearNav({ year }: { year?: string | null }) {
  const { activeYear, pastYearLink, futureYearLink } =
    await GetPostYearsNav.invoke(year ?? undefined)

  return (
    <div>
      {futureYearLink ? (
        <Link href={futureYearLink} aria-label="Future Year">
          <ArrowLeft className="inline-block size-3 mr-1 -mt-0.5" />
        </Link>
      ) : (
        <ArrowLeft className="inline-block size-3 mr-1 -mt-0.5 opacity-40" />
      )}
      <span className="tabular-nums">{activeYear}</span>
      {pastYearLink ? (
        <Link href={pastYearLink} aria-label="Previous Year">
          <ArrowRight className="inline-block size-3 ml-1 -mt-0.5" />
        </Link>
      ) : (
        <ArrowRight className="inline-block size-3 ml-1 -mt-0.5 opacity-50" />
      )}
    </div>
  )
}
