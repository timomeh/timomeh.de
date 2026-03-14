import Link from 'next/link'

import { Card } from '@/comps/card'
import { ListedShort } from '@/comps/listed-short'
import type { EnrichedShort } from '@/data/shorts/shorts.service'

type Prop = {
  shorts: EnrichedShort[]
}

export function ShortsTeaser({ shorts }: Prop) {
  return (
    <section className="relative">
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <header className="
            flex items-center justify-between px-4 py-3
            sm:px-6
            md:px-8
          ">
            <h2 className="font-serif text-lg font-semibold md:text-xl">
              <Link href="/shorts">Shorts</Link>
            </h2>
            <Link
              href="/shorts"
              className="
                text-sm font-normal whitespace-nowrap no-underline
                dark:text-blue-300
              "
            >
              View all
            </Link>
          </header>
          {shorts.map((short) => (
            <div className="xs:px-4 px-2 py-4 sm:p-6 md:p-8" key={short.id}>
              <ListedShort short={short} />
            </div>
          ))}
          <footer className="
            flex items-center justify-center px-4 py-3
            sm:px-6
            md:px-8
          ">
            <Link
              href="/shorts"
              className="
                text-sm font-normal whitespace-nowrap no-underline
                dark:text-blue-300
              "
            >
              Read more Shorts
            </Link>
          </footer>
        </div>
      </Card>
    </section>
  )
}
