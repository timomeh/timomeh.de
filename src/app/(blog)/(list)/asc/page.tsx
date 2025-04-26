import { PostsList } from '../posts-list'

export default async function Page() {
  return <PostsList sort="asc" />
}

export async function generateMetadata() {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
