import type { Metadata } from 'next'

import { Card } from '@/comps/card'

import { ListedShort } from '../../../comps/listed-short'
import { ListShorts } from './data'

export default async function Page() {
  const shorts = await ListShorts.invoke()

  return (
    <section className="relative mt-2">
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <header
            className="
              flex items-center justify-between px-4 py-3
              sm:px-6
              md:px-8
            "
          >
            <h2 className="font-serif text-lg font-semibold md:text-xl">
              Shorts
            </h2>
          </header>
          {shorts.map((short) => (
            <div className="xs:px-4 px-2 py-4 sm:p-6 md:p-8" key={short.id}>
              <ListedShort short={short} />
            </div>
          ))}
        </div>
      </Card>
    </section>
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
