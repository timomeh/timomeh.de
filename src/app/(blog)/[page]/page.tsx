import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'
import { PageMetadata } from '@/data/actions/pageMetadata'
import { ShowPage } from '@/data/actions/showPage'

type Props = {
  params: Promise<{ page: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { page, assetPrefix } = await ShowPage.invoke(params.page)

  return (
    <article
      lang={page.metaLang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <Prose>
        <MDX
          cacheKey={`page-${page.slug}`}
          cacheTags={['mdx-type:page', `mdx-page:${page.slug}`]}
          content={page.content}
          assetPrefix={assetPrefix}
        />
      </Prose>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return PageMetadata.invoke(params.page)
}
