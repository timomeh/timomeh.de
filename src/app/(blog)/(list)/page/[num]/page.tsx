import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pagination } from '@/comps/pagination'
import { getOlderPost, pagePublishedPosts } from '@/data/posts'
import { saneParseInt } from '@/lib/saneParseInt'

import { ListedPost } from '../../listed-post'

type Props = {
  params: Promise<{ num: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const num = saneParseInt(params.num)
  if (!num) notFound()

  const posts = await pagePublishedPosts(num)
  if (posts.length === 0) notFound()

  const olderPost = await getOlderPost(posts.at(-1)?.slug)
  const hasOlderPost = !!olderPost

  return (
    <>
      <div>
        {posts.map((post) => (
          <ListedPost slug={post.slug} key={post.slug} />
        ))}
      </div>
      <Pagination current={num} hasOlderPost={hasOlderPost} bottom />
    </>
  )
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: `Page ${params.num}`,
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
