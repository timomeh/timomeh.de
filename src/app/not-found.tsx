import { ReportBrokenLink } from '@/app/_comps/report-broken-link'

import BlogLayout from './(blog)/layout'

export default function NotFound() {
  return (
    <BlogLayout>
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
    </BlogLayout>
  )
}
