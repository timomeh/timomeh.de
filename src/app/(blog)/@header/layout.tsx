import { TruckIcon } from '@/comps/icons/truck'
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
                bg-yellow-200/50 will-change-transform
                [offset-path:ellipse(49.5px_19.5px_at_50%_50%)] motion-reduce:hidden"
            />
          </div>
          <div
            className="absolute left-[-338px] top-[-124px] h-3.5 w-3.5 transform-gpu
              animate-[path_25s_infinite_linear] text-gray-900/70 will-change-transform
              [offset-path:path('M226_171C240_181.5_259_185_278_182C297_179_322_166_341_154C360_142_409_114.5_400_100C391_85.5_359_91_344.5_93.5C330_96_301.5_112.5_284.5_115.5C267.5_118.5_225_120.5_219.5_115.5C214_110.5_230.5_108_242_112C253.5_116_290_117.5_300.5_114C311_110.5_343.5_89_359.5_89C375.5_89_399_93.8221_393_108.5C387_123.178_362.5_129_353.5_134C344.5_139_324.5_172.5_314.5_176C304.5_179.5_276_186_252_171C228_156_212_160.5_226_171Z')]
              [offset-rotate:auto_90deg] motion-reduce:hidden xs:left-[-335px] xs:top-[-120px]
              sm:left-[-315px] sm:top-[-156px]
              sm:[offset-path:path('M199_153.5C169.79_147.954_147.5_132_151_115.5C154.5_99_175.5_101.919_199_109.5C222.5_117.081_254.05_120.111_276_118C302_115.5_309.5_102_334.5_93.5C351.5_87.72_385.5_85_385.5_101.5C385.5_118_363.5_124.5_346_142.5C330.25_158.7_321.5_173_293_179C256.229_186.741_238.5_161_199_153.5Z')]
              dark:invisible"
          >
            <div className="animate-tucker relative flex h-3 w-3 items-center justify-center">
              <TruckIcon />
              <div className="absolute h-3 w-2 bg-black/5 blur-[1px]" />
            </div>
          </div>
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
