import { ArrowDownFromLine } from 'lucide-react'

import { ListedShort } from '@/app/(blog)/data'
import { ShortEntry } from '@/app/(blog)/short-entry'
import { PreventScrollLink } from '@/comps/prevent-scroll-link'

type Props = {
  shorts: ListedShort[]
}

export async function ShortsGroup({ shorts }: Props) {
  return (
    <div className="relative border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
        <ul className="group/shorts space-y-10">
          {shorts.map((short, i) => (
            <li
              key={short.id}
              data-overflow={shorts.length > 5 && i > 3}
              className="
                data-[overflow=true]:hidden
                data-[overflow=true]:group-has-target/shorts:block
              "
            >
              <ShortEntry short={short} linkTo="detail" />
            </li>
          ))}

          {/* show more */}
          {shorts.length > 5 && (
            <li
              className="
                flex justify-center
                group-has-target/shorts:invisible group-has-target/shorts:-mb-10 group-has-target/shorts:h-0
                md:justify-start
              "
            >
              <PreventScrollLink
                href={`#short-${shorts[4].id}`}
                className="group/link inline-flex hover:underline"
              >
                <div
                  className="
                    inline-flex h-8 items-center rounded-full bg-[#d1bdae]/50
                    px-4
                    md:h-10
                    dark:bg-[#98B7A7]/30
                  "
                >
                  <ArrowDownFromLine className="mr-3 size-4 md:size-5" />
                  <div
                    className="
                      min-w-0 text-sm text-stone-700
                      dark:text-stone-100
                    "
                  >
                    show {shorts.length - 4} more shorts
                  </div>
                </div>
              </PreventScrollLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
