import type { Metadata } from 'next'
import { Card } from '@/comps/card'
import { listShorts } from '@/data/shorts'
import { ListedShort } from '../../../comps/listed-short'

export default async function Page() {
  const shorts = await listShorts()

  return (
    <section className="mt-2 relative">
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <header className="px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
            <h2 className="font-serif text-lg md:text-xl font-semibold">
              Shorts
            </h2>
          </header>
          {shorts.map((short) => (
            <div className="px-2 py-4 xs:px-4 sm:p-6 md:p-8" key={short.id}>
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
