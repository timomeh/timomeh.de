import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pagination } from '@/comps/pagination'
import { contentAsset } from '@/data/cms'
import { getOlderPost, pagePublishedPosts } from '@/data/posts'
import { getTag } from '@/data/tags'
import { saneParseInt } from '@/lib/saneParseInt'

import { ListedPost } from '../../../../listed-post'

type Props = {
  params: Promise<{ num: string; tag: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const num = saneParseInt(params.num)
  if (!num) notFound()

  const posts = await pagePublishedPosts(num, { tag: params.tag })
  if (posts.length < 1) notFound()

  const olderPost = await getOlderPost(posts.at(-1)?.slug, { tag: params.tag })
  const hasOlderPost = !!olderPost

  return (
    <>
      <div>
        {posts.map((post) => (
          <ListedPost slug={post.slug} key={post.slug} />
        ))}
      </div>
      <Pagination
        bottom
        current={num}
        hasOlderPost={hasOlderPost}
        scope={`/tag/${params.tag}`}
      />
    </>
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  const metadata: Metadata = {
    title: `${tag.title}, Page ${params.num}`,
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
