import { notFound } from 'next/navigation'
import { MDX } from '@/comps/mdx/mdx'
import { getPage } from '@/data/pages'
import { contentAsset } from '@/data/cms'
import { Metadata } from 'next'
import { Prose } from '@/comps/prose'

type Props = {
  params: Promise<{ page: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const page = await getPage(params.page)
  if (!page) notFound()

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
