import { Footer } from '@/comps/footer'
import { Prose } from '@/comps/prose'
import { ReportBrokenLink } from '@/comps/report-broken-link'

export default function NotFound() {
  return (
    <>
      <div className="relative">
        <div className="p-4 sm:p-6 md:p-8">
          <Prose>
            <h1>Page not found</h1>
            <p>
              Sorry, you either found a broken link, or clicked on an old link.
              If you clicked on a link and arrived here, that could be my fault.
              Try the following steps:
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
      </div>
      <Footer />
    </>
  )
}
