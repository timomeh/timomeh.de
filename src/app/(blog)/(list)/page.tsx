import { Metadata } from 'next'

import { Pagination } from '@/comps/pagination'
import { getOlderPost, pagePublishedPosts } from '@/data/posts'

import { ListedPost } from './listed-post'

export const fetchCache = 'force-cache'

export default async function Page() {
  const posts = await pagePublishedPosts(0)

  const olderPost = await getOlderPost(posts.at(-1)?.slug)
  const hasOlderPost = !!olderPost

  return (
    <>
      <div>
        {posts.map((post) => (
          <ListedPost slug={post.slug} key={post.slug} />
        ))}
      </div>
      <Pagination current={0} hasOlderPost={hasOlderPost} bottom />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
