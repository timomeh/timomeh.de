import Link from 'next/link'

import { Tag } from '@/comps/tag'

export default function Loading() {
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <div className="mb-10 flex sm:pt-6">
        <Link href="/">
          <Tag color="#DEC1EF" clickable name="← Back" />
        </Link>
      </div>

      <article className="prose prose-invert relative">
        <div className="mb-1 flex flex-wrap items-center gap-1">
          <div
            className="font-pixel text-xs leading-none antialiased opacity-50
              [font-feature-settings:'ss01']"
          >
            <span className="animate-pulse text-purple-300">▛▙▖▖ ▚▙</span>
          </div>
          {/* keep spacing consistent by simulating the tag height */}
          <div className="h-[17px] w-1" />
        </div>
        <div
          className="mb-8 mt-2 animate-pulse font-pixel text-xl font-semibold leading-tight
            sm:text-2xl"
        >
          <span className="opacity-50">▙▚▛▞</span>
        </div>
      </article>
    </div>
  )
}
