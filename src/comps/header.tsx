import Link from 'next/link'

import { BlogTitle } from './me/blog-title'
import { Mug } from './me/mug'

export function Header() {
  return (
    <div
      className="group/header relative mx-auto flex max-w-2xl flex-row items-center justify-start
        px-4 py-10 sm:items-end sm:justify-end"
    >
      <div
        className="relative flex max-h-20 max-w-20 flex-shrink items-center justify-center
          sm:max-h-24 sm:max-w-24"
      >
        {/* glow */}
        <div
          className="pointer-events-none absolute h-[400px] w-[600px] rotate-6 transform
            bg-gradient-radial from-purple-300 opacity-15 mix-blend-difference"
        />

        <div className="relative">
          <Link
            href="/"
            className="relative block size-full select-none transition-transform ease-in-out
              motion-safe:hover:-rotate-3 motion-safe:hover:scale-110
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

      <div className="-mb-4 flex sm:min-w-[calc(50%-56px)] sm:flex-shrink-0">
        <div className="size-4 flex-shrink-0" />
        <BlogTitle />
      </div>
    </div>
  )
}
