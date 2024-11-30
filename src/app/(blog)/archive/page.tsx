'use cache'

import { Metadata } from 'next'

import { PostList } from './post-list'

export default async function Page() {
  return <PostList />
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Archive',
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
