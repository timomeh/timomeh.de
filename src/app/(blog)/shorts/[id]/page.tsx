import { Suspense } from 'react'

import { ShortEntry } from '@/app/(blog)/short-entry'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageLoading } from '@/comps/layout/page-loading'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { PageNavBack } from '@/comps/layout/page-nav-back'

import { getCachedShort, ShortMetadata } from '../data'

type Props = {
  params: Promise<{ id: string }>
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={<PageLoading chrome />}>
      <ShortPage {...props} />
    </Suspense>
  )
}

async function ShortPage(props: Props) {
  const params = await props.params
  const short = await getCachedShort(params.id)

  return (
    <>
      <PageNav>
        <PageNavBack href={`/shorts#short-${short.id}`} />
      </PageNav>
      <PageMain>
        <article lang={short.metaLang?.split('_')[0]} className="relative">
          <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
            <ShortEntry short={short} linkTo="list" />
            <div className="mt-4 ml-9 md:ml-14">
              <time
                className="font-mono text-xs text-current/60"
                dateTime={short.publishedAt.toISOString()}
              >
                {short.publishedAt.toISOString()}
              </time>
            </div>
          </div>
        </article>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return ShortMetadata.invoke(params.id)
}
