import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getNewerPost, getOlderPost, pagePublishedPosts } from '@/data/posts'
import { saneParseInt } from '@/lib/saneParseInt'

import { ListedPost } from '../../listed-post'
import { Pagination } from '../../pagination'

export const fetchCache = 'force-cache'

type Props = {
  params: Promise<{ year: string }>
}

export default async function Page({ params }: Props) {
  const year = saneParseInt((await params).year) || notFound()
  if (year > new Date().getFullYear()) notFound()
  if (year === new Date().getFullYear()) redirect('/')

  const posts = await pagePublishedPosts(year)
  if (posts.length < 1) notFound()

  const newerPost = await getNewerPost(posts[0].slug)
  const olderPost = await getOlderPost(posts[posts.length - 1].slug)

  return (
    <div className="flex flex-col items-center space-y-10 sm:mx-4">
      <Pagination
        newerYear={newerPost?.publishedAt.getFullYear()}
        olderYear={olderPost?.publishedAt.getFullYear()}
        thisYear={year}
        postCount={posts.length}
      />
      {posts.map((post) => (
        <ListedPost key={post.slug} slug={post.slug} continueMarker />
      ))}
      <Pagination
        newerYear={newerPost?.publishedAt.getFullYear()}
        olderYear={olderPost?.publishedAt.getFullYear()}
        thisYear={year}
        postCount={posts.length}
      />
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const year = saneParseInt((await params).year)

  return {
    title: String(year),
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
