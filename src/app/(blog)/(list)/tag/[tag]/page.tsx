import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PostList } from '../../post-list'
import { getCategoryBySlug } from '@/app/_data/category.dto'

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
  const category = await getCategoryBySlug(params.tag)
  if (!category) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4">
      <PostList tag={params.tag} />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.tag)
  if (!category) notFound()

  return {
    title: category.name,
    description: `More or less coherent thoughts about ${category.name}.`,
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }
}
