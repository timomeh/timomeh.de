import { Footer } from '@/comps/footer'
import { Prose } from '@/comps/prose'
import { ReportBrokenLink } from '@/comps/report-broken-link'

export default function NotFound() {
  return (
    <>
      <main className="relative z-30 w-full flex-1">
        <div className="mx-auto mt-10 max-w-2xl px-4">
          <Prose crtTitle>
            <h1>ERR 404</h1>
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
              <li
                dangerouslySetInnerHTML={{
                  __html: ' <a href="javascript:history.back()">go back</a>',
                }}
              />
            </ol>
          </Prose>
        </div>
      </main>
      <Footer />
    </>
  )
}
