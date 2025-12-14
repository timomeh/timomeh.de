import Link from 'next/link'

// import { Aurora } from '@/comps/aurora'
// import { Contours } from '@/comps/contours'
import { Mug } from '@/comps/me/mug'
import { Seasons } from '@/comps/seasons'

type Props = {
  kicker: React.ReactNode
  backdrop: React.ReactNode
}

export default function Layout({ kicker, backdrop }: Props) {
  return (
    <div className="group/header">
      <div
        className="grid [grid-template-rows:0fr] transition-all duration-700
          ease-in-out has-[.header-backdrop-signal]:[grid-template-rows:1fr]"
      >
        <div className="min-h-0">{backdrop}</div>
      </div>

      <div
        className="absolute right-0 left-0 -top-10 sm:-top-16 md:-top-28 -z-10 hidden
          w-full group-has-[.header-no-backdrop-signal]/header:block opacity-20 mix-blend-darken dark:opacity-40 dark:mix-blend-lighten"
        data-visual-test="removed"
      >
        <Seasons />
      </div>

      {/* <div
        className="absolute -top-[140px] right-0 left-0 -z-10 hidden h-[550px]
          w-full group-has-[.header-no-backdrop-signal]/header:block"
        data-visual-test="removed"
      >
        <Aurora />
        <Contours />
      </div> */}

      <div
        className="relative z-20 overflow-hidden px-4 pt-14 pb-16 sm:pt-28
          sm:pb-28"
      >
        <div className="flex w-full items-center justify-center">
          <div className="relative size-18 sm:size-24">
            <Link
              aria-label="Go to home"
              href="/"
              className="group/link relative block size-full
                transition-transform ease-in-out select-none
                motion-safe:hover:scale-110 motion-safe:hover:-rotate-1
                motion-safe:active:scale-105"
            >
              <Mug />
            </Link>
          </div>
          <div
            className="ml-2 text-[#282220] text-shadow-sm text-shadow-white/20
              dark:text-[#D9FEDB] dark:text-shadow-black/20 dark:text-shadow-md"
          >
            <span
              data-visual-test="removed"
              className="text-2xs inline-block font-mono font-semibold
                opacity-40 blur-[2px] transition-all
                has-[span[data-loaded=true]]:opacity-100
                has-[span[data-loaded=true]]:blur-none sm:w-0 sm:text-xs
                sm:whitespace-nowrap"
            >
              {kicker}
            </span>
            <br />
            <Link
              href="/"
              className="font-serif text-xl leading-none font-semibold
                sm:text-[1.7rem] dark:font-normal"
            >
              Timo Mämecke
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
