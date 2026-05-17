import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ShortEntry } from '@/app/(blog)/short-entry'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { Prose } from '@/comps/prose'
import { ScrollToHash } from '@/comps/scroll-to-hash'
import { EnrichedShort } from '@/data/shorts/shorts.service'

import { ListShorts } from './data'

const BLOCKING_RENDERED_AMOUNT = 20

export default async function Page() {
  const shorts = await ListShorts.invoke()
  const initial = shorts.slice(0, BLOCKING_RENDERED_AMOUNT)
  const rest = shorts.slice(BLOCKING_RENDERED_AMOUNT)

  return (
    <>
      <PageNav />
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose size="sm">
            <h1 className="!mb-1">Shorts</h1>
            <p className="!mt-1">
              A collection of short-form posts. It’s like Twitter but there’s
              only one idiot: me.
            </p>
          </Prose>

          <ScrollToHash />
          <ul className="mt-14 space-y-10">
            {initial.map(renderItem)}
            <Suspense fallback={<LoadingFallback />}>
              <RestOfShorts shorts={rest} />
            </Suspense>
          </ul>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}

async function RestOfShorts({ shorts }: { shorts: EnrichedShort[] }) {
  return (
    <>
      <ScrollToHash />
      {shorts.map(renderItem)}
    </>
  )
}

function renderItem(short: EnrichedShort) {
  return (
    <li key={short.id}>
      <ShortEntry short={short} linkTo="detail" />
    </li>
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

function LoadingFallback() {
  return (
    <li id="loading-anchor">
      <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
        <p className="mb-[800px] animate-pulse text-center">
          Hang on, loading more…
        </p>
      </div>
    </li>
  )
}
