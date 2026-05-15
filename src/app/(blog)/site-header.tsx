import Link from 'next/link'

import { Aurora } from '@/comps/aurora'
import { Contours } from '@/comps/contours'
import { Mug } from '@/comps/me/mug'

type Props = {
  kicker: React.ReactNode
  backdrop: React.ReactNode
}

export function SiteHeader({ kicker, backdrop }: Props) {
  return (
    <div className="group/header">
      <div
        className="
          grid grid-rows-[0fr]
          transition-[grid-template-rows]
          duration-1200 ease-[cubic-bezier(0.4,0,0.05,1)]
          has-[.header-backdrop-signal]:grid-rows-[1fr]
        "
      >
        <div className="min-h-0">{backdrop}</div>
      </div>

      <div
        className="
          absolute -top-[140px] right-0 left-0 -z-10 hidden h-[550px] w-full
          group-has-[.header-no-backdrop-signal]/header:block
        "
        data-visual-test="removed"
      >
        <Aurora />
        <Contours />
      </div>

      <div
        className="
          mug relative z-20 overflow-hidden px-4 pt-20 pb-8
          group-has-[.header-backdrop-signal]/header:!pb-6
          sm:pt-28 sm:pb-28
        "
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-8">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="relative -ml-3 size-20">
              <Link
                aria-label="Go to home"
                href="/"
                className="
                  group/link relative block size-full transition-transform
                  ease-in-out select-none
                  motion-safe:hover:scale-110 motion-safe:hover:-rotate-1
                  motion-safe:active:scale-105
                "
              >
                <Mug />
              </Link>
            </div>
            <div
              className="
                mt-2 text-center text-[#282220] text-shadow-sm
                text-shadow-white/20
                dark:text-[#D9FEDB] dark:text-shadow-black/20
                dark:text-shadow-md
              "
            >
              <span
                data-visual-test="removed"
                className="
                  mb-1 inline-block font-mono text-xs font-semibold text-balance
                  opacity-40 blur-[2px] transition-all
                  has-[span[data-loaded=true]]:opacity-80
                  has-[span[data-loaded=true]]:blur-none
                "
              >
                {kicker}
              </span>
              <br />
              <Link
                href="/"
                className="
                  font-mono text-2xl leading-none font-bold
                  dark:font-normal
                "
              >
                Timo Mämecke
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
