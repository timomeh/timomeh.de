import type { Metadata } from 'next'

import { ShortEntry } from '@/app/(blog)/short-entry'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { Prose } from '@/comps/prose'

import { ListShorts } from './data'

export default async function Page() {
  const shorts = await ListShorts.invoke()

  return (
    <>
      <PageNav>all shorts</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose size="sm">
            <h1 className="!mb-1">Shorts</h1>
            <p className="!mt-1">
              A collection of short-form posts. Like Twitter, but it's just me.
            </p>
          </Prose>

          <ul className="mt-14 space-y-10">
            {shorts.map((short) => (
              <li key={short.id} id={`short-${short.id}`}>
                <ShortEntry short={short} linkTo="detail" />
              </li>
            ))}
          </ul>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Shorts',
    alternates: {
      types: {
        'application/atom+xml': '/shorts/feed.atom',
        'application/rss+xml': '/shorts/feed.rss',
        'application/feed+json': '/shorts/feed.json',
      },
    },
  }

  return metadata
}
