import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GlassPill } from '@/comps/glass-pill'
import { contentAsset } from '@/data/cms'
import { listPublishedPosts } from '@/data/posts'
import { getTag } from '@/data/tags'

import { ListedPost } from '../../listed-post'
import { parseSort } from '../../parse-sort'

type Props = {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const fetchCache = 'force-cache'

export default async function Page({ params, searchParams }: Props) {
  const sort = parseSort((await searchParams).sort)
  const tagSlug = (await params).tag
  const posts = await listPublishedPosts({ tag: tagSlug, sort })
  if (posts.length < 1) notFound()

  const tag = await getTag(tagSlug)

  return (
    <div className="space-y-10">
      <div className="mb-4 flex justify-center">
        <GlassPill>
          <h3>{groupTitle(tag?.title || tagSlug, posts.length)}</h3>
        </GlassPill>
      </div>
      {posts.map((post) => (
        <ListedPost slug={post.slug} key={post.slug} />
      ))}
    </div>
  )
}

function groupTitle(tag: string, amount: number) {
  const posts = amount > 1 ? 'posts' : 'post'
  return `${amount} ${posts} tagged ${tag}`
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
