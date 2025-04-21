import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { contentAsset } from '@/data/cms'
import { getTag } from '@/data/tags'

type Props = {
  children: React.ReactNode
  params: Promise<{ tag: string }>
}

export const fetchCache = 'force-cache'

export default function Layout({ children }: Props) {
  return <>{children}</>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  const metadata: Metadata = {
    title: tag.title,
    description:
      tag.meta.description ||
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

  if (tag.meta.image) {
    metadata.openGraph!.images = [
      { url: contentAsset('tags', tag.slug, tag.meta.image) },
    ]
  }

  return metadata
}
