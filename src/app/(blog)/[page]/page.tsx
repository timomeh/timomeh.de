'use cache'

import { notFound } from 'next/navigation'
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { MDX } from '@/comps/mdx/mdx'
import { getPage } from '@/data/pages'
import { contentAsset } from '@/data/cms'
import { Metadata } from 'next'
import { Prose } from '@/comps/prose'

type Props = {
  params: Promise<{ page: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const page = await getPage(params.page)
  if (!page) notFound()

  cacheTag('page', `page:${page.slug}`)

  return (
    <article className="relative animate-fade-in">
      <Prose>
        <MDX
          content={page.content}
          assetPrefix={contentAsset('pages', page.slug, '')}
        />
      </Prose>
    </article>
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const page = await getPage(params.page)
  if (!page) return {}

  cacheTag('page', `page:${page.slug}`)

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
