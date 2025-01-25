import { getOlderPost, pagePublishedPosts } from '@/data/posts'
import { ListedPost } from './listed-post'
import { Pagination } from '@/comps/pagination'
import { Metadata } from 'next'

export const fetchCache = 'force-cache'

export default async function Page() {
  const posts = await pagePublishedPosts(0)

  const olderPost = await getOlderPost(posts.at(-1)?.slug)
  const hasOlderPost = !!olderPost

  return (
    <>
      {posts.map((post) => (
        <ListedPost slug={post.slug} key={post.slug} />
      ))}
      <div className="border-beige/50 border-t dark:border-white/10" />
      <Pagination current={0} hasOlderPost={hasOlderPost} bottom />
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
