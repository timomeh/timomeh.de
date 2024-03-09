import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { listTags } from '@/lib/blog'

import PostList from '../post-list'

type Props = {
  params: {
    tag: string
  }
}

export default async function Page({ params }: Props) {
  const tags = await listTags()
  const tag = tags.find((t) => t.slug === params.tag)
  if (!tag && params.tag !== 'everything') notFound()

  return (
    <main className="mx-auto max-w-2xl px-4">
      <PostList tag={params.tag === 'everything' ? undefined : params.tag} />
    </main>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (params.tag === 'everything') {
    return {
      alternates: {
        canonical: '/',
      },
    }
  }

  const tags = await listTags()
  const tag = tags.find((t) => t.slug === params.tag)
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
