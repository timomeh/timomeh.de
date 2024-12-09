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
        className="relative z-30 flex max-h-20 max-w-20 flex-shrink items-center justify-center
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
            className="absolute left-full top-1 ml-3 hidden scale-90 whitespace-nowrap font-pixel
              text-xl font-bold uppercase leading-none tracking-tighter opacity-0
              transition-all delay-[2s] duration-200
              group-has-[.title-name:hover]/header:scale-100
              group-has-[.title-name:hover]/header:animate-[blink_130ms_2]
              group-has-[.title-name:hover]/header:opacity-100
              group-has-[.title-name:hover]/header:delay-0
              group-has-[.title-name:hover]/header:duration-[260ms] motion-reduce:hidden
              dark:block"
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

      <div
        className="relative z-20 -mb-4 flex mix-blend-multiply sm:min-w-[calc(50%-56px)]
          sm:flex-shrink-0 dark:mix-blend-lighten"
      >
        <div className="size-4 flex-shrink-0" />
        <div className="group isolate flex">
          {/* orbit */}
          <div
            data-visual-test="removed"
            className="pointer-events-none invisible absolute z-[-1] -mt-1 ml-16 h-[40px] w-[100px]
              rotate-[35deg] transform-gpu rounded-[100%] border border-yellow-50/10
              transition-transform duration-1000 ease-in-out
              motion-safe:group-hover:rotate-[30deg] motion-safe:group-hover:scale-125
              dark:visible"
          >
            <div
              className="h-1 w-1 transform-gpu animate-[path_15s_infinite_linear] rounded-full
                bg-yellow-200/50 [offset-path:ellipse(49.5px_19.5px_at_50%_50%)]
                motion-reduce:hidden"
            />
          </div>
          <div
            className="absolute left-[-338px] top-[-124px] h-1 w-1 transform-gpu
              animate-[path_25s_infinite_linear] rounded-full bg-[#755f4b]/80
              [offset-path:path('M261.5_159c-22_0-85.5-17.5-80-36_4.459-15_46_0_80_0s59-15.5_84.5-21_11.891_18.76_0_29c-18_15.5-48_28-84.5_28Z')]
              motion-reduce:hidden xs:left-[-335px] xs:top-[-120px] sm:left-[-315px]
              sm:top-[-156px] dark:invisible"
          />

          <div
            className="font-display text-xs leading-none text-gray-800 xs:text-sm dark:text-yellow-100
              dark:[text-shadow:0px_0px_6px_rgba(0,0,0,0.3)]"
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
                className="title-name inline-block text-nowrap text-xl font-semibold"
              >
                Timo Mämecke
              </Link>
              <div
                aria-hidden
                className="absolute left-10 top-full translate-x-0 rotate-1 leading-none text-gray-700
                  opacity-0 transition-all group-has-[.title-name:hover]/header:-translate-x-2
                  group-has-[.title-name:hover]/header:rotate-3
                  group-has-[.title-name:hover]/header:opacity-100 dark:hidden"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="-mt-1.5 mr-0.5 inline-block size-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 15.5C9.5 21.5 6 15.5 6 4.5M6 4.5L3 9M6 4.5L10.5 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                about me
              </div>
            </span>
          </div>
        </div>
      </div>
      {backdrop}
    </div>
  )
}
