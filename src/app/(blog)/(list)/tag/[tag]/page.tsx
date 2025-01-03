import { getOlderPost, pagePublishedPosts } from '@/data/posts'
import { ListedPost } from '../../listed-post'
import { Pagination } from '@/comps/pagination'
import { getTag } from '@/data/tags'
import { Metadata } from 'next'
import { contentAsset } from '@/data/cms'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ tag: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const posts = await pagePublishedPosts(0, { tag: params.tag })
  if (posts.length < 1) notFound()

  const olderPost = await getOlderPost(posts.at(-1)?.slug, { tag: params.tag })
  const hasOlderPost = !!olderPost

  return (
    <>
      {posts.map((post) => (
        <ListedPost slug={post.slug} key={post.slug} />
      ))}
      <div className="border-t border-beige/50 dark:border-white/10" />
      <Pagination
        bottom
        current={0}
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
