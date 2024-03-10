import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getTag } from '@/lib/blog'

import { PostList } from '../../post-list'

export const dynamic = 'force-static'
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: {
    tag: string
  }
}

export default async function Page({ params }: Props) {
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4">
      <PostList tag={params.tag} />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  return {
    title: tag.name,
    description: `More or less coherent thoughts about ${tag.name}.`,
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }
}
