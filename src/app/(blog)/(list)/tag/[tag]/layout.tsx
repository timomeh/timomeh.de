import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { contentAsset } from '@/data/cms'
import { getTagBySlug } from '@/data/tags'

type Props = {
  children: React.ReactNode
  params: Promise<{ tag: string }>
}

export default function Layout({ children }: Props) {
  return <>{children}</>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const tag = await getTagBySlug(params.tag)
  if (!tag) notFound()

  const metadata: Metadata = {
    title: tag.title,
    description:
      tag.metaDescription ||
      `More or less coherent thoughts about ${tag.title}.`,
    openGraph: {},
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }

  if (tag.metaImage && metadata.openGraph) {
    metadata.openGraph.images = [
      { url: contentAsset('tags', tag.slug, tag.metaImage) },
    ]
  }

  return metadata
}
