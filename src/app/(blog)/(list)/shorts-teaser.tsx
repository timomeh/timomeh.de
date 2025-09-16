import Link from 'next/link'
import { Card } from '@/comps/card'
import { ListedShort } from '@/comps/listed-short'
import type { Short } from '@/data/shorts'

type Prop = {
  shorts: Short[]
}

export function ShortsTeaser({ shorts }: Prop) {
  return (
    <section>
      <Card>
        <div className="divide-y divide-gray-400/30 dark:divide-gray-600/30">
          <header className="px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
            <h2 className="font-serif text-lg md:text-xl font-semibold">
              <Link href="/shorts">Shorts</Link>
            </h2>
            <Link
              href="/shorts"
              className="font-normal text-sm whitespace-nowrap no-underline dark:text-blue-300"
            >
              View all
            </Link>
          </header>
          {shorts.map((short) => (
            <div className="px-2 py-4 xs:px-4 sm:p-6 md:p-8" key={short.id}>
              <ListedShort short={short} />
            </div>
          ))}
          <footer className="px-4 sm:px-6 md:px-8 py-3 flex justify-center items-center">
            <Link
              href="/shorts"
              className="font-normal text-sm whitespace-nowrap no-underline dark:text-blue-300"
            >
              Read more Shorts
            </Link>
          </footer>
        </div>
      </Card>
    </section>
  )
}
