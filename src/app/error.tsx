'use client'

import { ReportBrokenPage } from '@/comps/report-broken-link'

import BlogLayout from './(blog)/layout'

type Props = {
  reset: () => void
}

export default function Error({ reset }: Props) {
  return (
    <BlogLayout>
      <div className="mx-auto max-w-2xl px-4">
        <div className="prose prose-invert">
          <h1 className="effect-crt-blue font-pixel text-4xl font-bold leading-none">
            ERR 500
          </h1>
          <p>
            Whoopsie daisy, something went terribly wrong. Not all hope is lost,
            you can try the following steps:
          </p>
          <ol>
            <li>
              <a role="button" onClick={() => reset()}>
                try to load this page again
              </a>
            </li>
            <li>come back later</li>
            <li>
              <ReportBrokenPage />
            </li>
            <li>
              <a href="https://www.youtube.com/watch?v=1SIIQKeIVRg&list=PLhNfpsFRdENmOmuPoWFhYDB7E-Ex2Hpk-">
                watch some important videos
              </a>
            </li>
          </ol>
        </div>
      </div>
    </BlogLayout>
  )
}
