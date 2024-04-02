import { Metadata } from 'next'

import { PostList } from './post-list'

export default async function Page() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <PostList />
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
