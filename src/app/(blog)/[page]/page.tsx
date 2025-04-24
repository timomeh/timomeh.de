import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPageBySlug } from '@/data/pages'

type Props = {
  params: Promise<{ page: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const page = await getPageBySlug(params.page)
  if (!page) notFound()

  return (
    <article
      lang={page.metaLang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <>
        <Prose>
          <MDX
            cacheKey={`page-${page.slug}`}
            cacheTags={['mdx-type:page', `mdx-page:${page.slug}`]}
            content={page.content}
            assetPrefix={contentAsset('pages', page.slug, '')}
          />
        </Prose>
      </>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const page = await getPageBySlug(params.page)
  if (!page) notFound()

  const metadata: Metadata = {
    title: page.title,
    description: page.metaDescription,
    openGraph: {},
  }

  if (page.metaImage) {
    metadata.openGraph!.images = [
      { url: contentAsset('pages', page.slug, page.metaImage) },
    ]
  }

  return metadata
}
