import { getOlderPost, pagePublishedPosts } from '@/data/posts'
import { saneParseInt } from '@/lib/saneParseInt'
import { notFound } from 'next/navigation'
import { Pagination } from '@/comps/pagination'
import { ListedPost } from '../../../../listed-post'
import { getTag } from '@/data/tags'
import { Metadata } from 'next'
import { contentAsset } from '@/data/cms'

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
      <div className="mb-12">
        <Pagination
          top
          current={num}
          hasOlderPost={hasOlderPost}
          scope={`/tag/${params.tag}`}
        />
      </div>
      {posts.map((post) => (
        <ListedPost slug={post.slug} key={post.slug} />
      ))}
      <div className="border-t border-beige/50 dark:border-white/10" />
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
