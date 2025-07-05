import { PostsList } from '../posts-list'
import { ReadMorePosts } from '../read-more-posts'

export default async function Page() {
  return (
    <>
      <PostsList sort="asc" />
      <ReadMorePosts />
    </>
  )
}

export async function generateMetadata() {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
