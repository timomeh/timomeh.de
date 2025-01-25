import { Aurora } from '@/comps/aurora'
import { Contours } from '@/comps/contours'
import { Mug } from '@/comps/me/mug'
import { SocialBox } from '@/comps/social-box'
import Link from 'next/link'

type Props = {
  kicker: React.ReactNode
  backdrop: React.ReactNode
}

export default function Layout({ kicker, backdrop }: Props) {
  return (
    <div
      className="group/header mx-auto flex max-w-2xl flex-row items-center justify-start px-4
        py-10 sm:items-end sm:justify-end"
    >
      <div
        className="absolute -top-[140px] left-0 right-0 hidden h-[550px] w-full
          group-has-[.header-backdrop-signal]/header:block"
        data-visual-test="removed"
      >
        <Aurora />
        <Contours />
      </div>
      <div
        className="relative z-30 flex max-h-20 max-w-20 shrink items-center justify-center
          sm:max-h-24 sm:max-w-24"
      >
        <div className="relative">
          <Link
            title="Go to home"
            href="/"
            className="group/link relative block size-full rotate-0 select-none transition-transform
              ease-in-out motion-safe:hover:-rotate-3 motion-safe:hover:scale-110
              motion-safe:active:-rotate-2 motion-safe:active:scale-105"
          >
            <Mug />
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 z-10 h-0">
        <div className="relative mx-auto max-w-2xl px-4">
          <SocialBox />
        </div>
      </div>

      <div
        className="relative z-20 -mb-4 flex mix-blend-multiply sm:min-w-[calc(50%-56px)]
          sm:shrink-0 dark:mix-blend-lighten"
      >
        <div className="size-4 shrink-0" />
        <div className="group isolate flex">
          <div
            className="font-display text-xs leading-none text-gray-800 xs:text-sm dark:text-teal-100
              dark:[text-shadow:0px_0px_8px_rgba(207,250,254,0.3)]"
          >
            <span data-visual-test="removed">
              <span
                className="inline-block opacity-40 blur-[2px] transition-all
                  has-[span[data-loaded=true]]:opacity-100 has-[span[data-loaded=true]]:blur-none"
              >
                {kicker}
              </span>
            </span>
            <span className="relative -mt-1 block">
              <Link
                href="/about"
                className="title-name inline-block text-nowrap text-xl font-semibold antialiased
                  duration-700"
              >
                Timo Mämecke
              </Link>
            </span>
          </div>
        </div>
      </div>
      {backdrop}
    </div>
  )
}
