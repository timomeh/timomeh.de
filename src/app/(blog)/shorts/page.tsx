import type { Metadata } from 'next'

import { ListedShort } from '../../../comps/listed-short'
import { ListShorts } from './data'

export default async function Page() {
  const shorts = await ListShorts.invoke()

  return (
    <div className="relative">
      <div className="mx-auto max-w-2xl space-y-12 p-4 sm:p-6 md:p-8 md:py-12">
        {shorts.map((short) => (
          <ListedShort short={short} key={short.id} />
        ))}
      </div>
    </div>
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
