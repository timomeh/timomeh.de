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
        className="relative z-20 flex max-h-20 max-w-20 flex-shrink items-center justify-center
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

          <div
            aria-hidden
            className="absolute left-full top-1 ml-3 scale-90 whitespace-nowrap font-pixel text-xl
              font-bold uppercase leading-none tracking-tighter opacity-0 transition-all
              delay-[2s] duration-200 group-has-[.title-name:hover]/header:scale-100
              group-has-[.title-name:hover]/header:animate-[blink_130ms_2]
              group-has-[.title-name:hover]/header:opacity-100
              group-has-[.title-name:hover]/header:delay-0
              group-has-[.title-name:hover]/header:duration-[260ms] motion-reduce:hidden"
          >
            <span className="effect-crt-blue">it me!</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 z-10 h-0">
        <div className="relative mx-auto max-w-2xl px-4">
          <SocialBox />
        </div>
      </div>

      <div className="relative z-20 -mb-4 flex sm:min-w-[calc(50%-56px)] sm:flex-shrink-0">
        <div className="size-4 flex-shrink-0" />
        <div className="group flex">
          {/* orbit */}
          <div
            data-visual-test="removed"
            className="pointer-events-none absolute -mt-1 ml-16 h-[40px] w-[100px] rotate-[35deg]
              transform-gpu rounded-[100%] border border-yellow-50/10 transition-transform
              duration-1000 ease-in-out motion-safe:group-hover:rotate-[30deg]
              motion-safe:group-hover:scale-125"
          >
            <div
              className="h-1 w-1 transform-gpu animate-[path_15s_infinite_linear] rounded-full
                bg-yellow-200/50 [offset-path:ellipse(49.5px_19.5px_at_50%_50%)]
                motion-reduce:hidden"
            />
          </div>

          <div
            className="font-display text-xs leading-none text-yellow-100
              [text-shadow:0px_0px_6px_rgba(0,0,0,0.3)] xs:text-sm"
          >
            <span data-visual-test="removed">{kicker}</span>
            <span className="-mt-1 block xs:-mt-2">
              <Link
                href="/about"
                className="title-name inline-block text-nowrap text-xl font-semibold"
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
