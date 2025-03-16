import { CircleArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { GlassPill } from '@/comps/glass-pill'
import { getOlderPost, pagePublishedPosts } from '@/data/posts'

import { groupPosts, Marker } from './group-posts'
import { ListedPost } from './listed-post'
import { Pagination } from './pagination'

export const fetchCache = 'force-cache'

export default async function Page() {
  const year = new Date().getFullYear()
  const posts = await pagePublishedPosts(year)
  const olderPost = await getOlderPost(posts[posts.length - 1].slug)
  const groupedPosts = groupPosts(posts)

  return (
    <div className="flex flex-col items-center space-y-10 sm:mx-4">
      {groupedPosts.map((group) => (
        <Fragment key={group.marker}>
          <header className="wrapper mb-6 not-first-of-type:mt-8">
            <GlassPill>
              <h2>
                <GroupTitle marker={group.marker} amount={group.posts.length} />
              </h2>
            </GlassPill>
          </header>
          {group.posts.map((post, i) =>
            group.marker === 'last_year' && i === group.posts.length - 1 ? (
              <Link
                href={`/in/${post.publishedAt.getFullYear()}#${post.slug}`}
                key={post.slug}
                className="transition hover:translate-x-0.5"
              >
                <GlassPill>
                  <div className="flex items-center">
                    <span>
                      more posts from {post.publishedAt.getFullYear()}
                    </span>
                    <CircleArrowRight className="-mr-1.5 ml-1.5 size-4 opacity-70" />
                  </div>
                </GlassPill>
              </Link>
            ) : (
              <ListedPost key={post.slug} slug={post.slug} />
            ),
          )}
        </Fragment>
      ))}
      {groupedPosts.at(-1)?.marker !== 'last_year' && (
        <Pagination
          olderYear={olderPost?.publishedAt.getFullYear()}
          thisYear={year}
          postCount={posts.length}
        />
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}

function GroupTitle(props: { marker: Marker; amount: number }) {
  const { amount, marker } = props

  const posts = amount > 1 ? 'posts' : 'post'
  switch (marker) {
    case 'this_week':
      return (
        <>
          <em>
            {amount} {posts}
          </em>{' '}
          <span>this week</span>
        </>
      )
    case 'last_week':
      return (
        <>
          <em>
            {amount} {posts}
          </em>{' '}
          <span>last week</span>
        </>
      )
    case 'this_month':
      return (
        <>
          <em>
            {amount} {posts}
          </em>{' '}
          <span>earlier this month</span>
        </>
      )
    case 'last_month':
      return (
        <>
          <em>
            {amount} {posts}
          </em>{' '}
          <span>past month</span>
        </>
      )
    case 'this_year':
      return (
        <>
          <em>
            {amount} {posts}
          </em>{' '}
          <span>earlier this year</span>
        </>
      )
    case 'last_year':
      return <span>posts from last year</span>
  }
}
