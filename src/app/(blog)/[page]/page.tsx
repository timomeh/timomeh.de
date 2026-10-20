import { Suspense } from 'react'

import { PageFooter } from '@/comps/layout/page-footer'
import { PageLoading } from '@/comps/layout/page-loading'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'

import { getCachedPage, PageMetadata } from './data'

type Props = {
  params: Promise<{ page: string }>
}

export default function Page(props: Props) {
  return (
    <>
      <PageNav />
      <Suspense fallback={<PageLoading />}>
        <PageContent {...props} />
      </Suspense>
      <PageFooter />
    </>
  )
}

async function PageContent(props: Props) {
  const params = await props.params
  const { page, assetPrefix } = await getCachedPage(params.page)

  return (
    <PageMain>
      <article
        lang={page.metaLang?.split('_')[0]}
        className="relative"
        data-landmark="content-page"
      >
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose>
            <MDX
              cacheKey={`page-${page.slug}`}
              cacheTags={['mdx-type:page', `mdx-page:${page.slug}`]}
              content={page.content}
              assetPrefix={assetPrefix}
            />
          </Prose>
        </div>
      </article>
    </PageMain>
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return PageMetadata.invoke(params.page)
}
