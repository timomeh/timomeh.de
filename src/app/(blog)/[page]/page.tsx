import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPage } from '@/data/pages'

type Props = {
  params: Promise<{ page: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const page = await getPage(params.page)
  if (!page) notFound()

  return (
    <article
      lang={page.meta.lang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <div className="p-4 sm:p-6 md:p-8">
        <ViewTransition>
          <Prose>
            <MDX
              cacheKey={`page-${page.slug}`}
              cacheTags={['mdx-type:page', `mdx-page:${page.slug}`]}
              content={page.content}
              assetPrefix={contentAsset('pages', page.slug, '')}
            />
          </Prose>
        </ViewTransition>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const page = await getPage(params.page)
  if (!page) notFound()

  const metadata: Metadata = {
    title: page.title,
    description: page.meta.description,
    openGraph: {},
  }

  if (page.meta.image) {
    metadata.openGraph!.images = [
      { url: contentAsset('pages', page.slug, page.meta.image) },
    ]
  }

  return metadata
}
