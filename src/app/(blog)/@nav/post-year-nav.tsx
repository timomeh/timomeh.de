import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { GetPostYearsNav } from './data'

export async function PostYearNav({ year }: { year?: string | null }) {
  const { activeYear, pastYearLink, futureYearLink } =
    await GetPostYearsNav.invoke(year ?? undefined)

  return (
    <nav aria-label="Publication years">
      {futureYearLink ? (
        <Link href={futureYearLink} aria-label="Future Year">
          <ArrowLeft className="-mt-0.5 mr-1 inline-block size-3" />
        </Link>
      ) : (
        <ArrowLeft className="-mt-0.5 mr-1 inline-block size-3 opacity-40" />
      )}
      <span className="tabular-nums">{activeYear}</span>
      {pastYearLink ? (
        <Link href={pastYearLink} aria-label="Previous Year">
          <ArrowRight className="-mt-0.5 ml-1 inline-block size-3" />
        </Link>
      ) : (
        <ArrowRight className="-mt-0.5 ml-1 inline-block size-3 opacity-50" />
      )}
    </nav>
  )
}
