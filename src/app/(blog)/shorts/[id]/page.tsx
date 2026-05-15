import { ShortEntry } from '@/app/(blog)/short-entry'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { PageNavBack } from '@/comps/layout/page-nav-back'

import { ShortMetadata, ShowShort } from '../data'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const short = await ShowShort.invoke(params.id)

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

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return ShortMetadata.invoke(params.id)
}
