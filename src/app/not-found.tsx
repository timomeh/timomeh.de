import { ReportBrokenLink } from '@/app/_comps/report-broken-link'
import { HeaderSpacer } from '@/app/_comps/header-spacer'
import { HeaderBackdropHaze } from '@/app/_comps/header-backdrop-haze'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderSpacer>
        <HeaderBackdropHaze />
      </HeaderSpacer>
      <main className="relative z-30 w-full flex-1">
        <div className="mx-auto max-w-2xl px-4">
          <div className="prose prose-invert">
            <h1 className="effect-crt-blue font-pixel text-4xl font-bold leading-none">
              ERR 404
            </h1>
            <p>
              Sorry, you either found a broken link, or clicked an old link. If
              you clicked on a link and arrived here, that’s my fault. Try the
              following steps:
            </p>
            <ol>
              <li>
                <ReportBrokenLink /> if you think it’s my fault
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=1SIIQKeIVRg&list=PLhNfpsFRdENmOmuPoWFhYDB7E-Ex2Hpk-">
                  watch some important videos
                </a>
              </li>
              <li>
                <a href="javascript:history.back()">go back</a>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
