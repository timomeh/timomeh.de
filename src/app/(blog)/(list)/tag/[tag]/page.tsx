import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { contentAsset } from '@/data/cms'
import { listPublishedPosts } from '@/data/posts'
import { getTag } from '@/data/tags'

import { ListedPost } from '../../listed-post'

type Props = {
  params: Promise<{ tag: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const posts = await listPublishedPosts({ tag: params.tag })
  if (posts.length < 1) notFound()

  return (
    <div className="flex flex-col items-center space-y-10 sm:mx-4">
      {posts.map((post) => (
        <ListedPost slug={post.slug} key={post.slug} />
      ))}
    </div>
  )
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
