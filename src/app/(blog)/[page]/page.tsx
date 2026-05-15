import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'

import { PageMetadata, ShowPage } from './data'

type Props = {
  params: Promise<{ page: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { page, assetPrefix } = await ShowPage.invoke(params.page)

  return (
    <>
      <PageNav>single page</PageNav>
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
      <PageFooter />
    </>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return PageMetadata.invoke(params.page)
}
