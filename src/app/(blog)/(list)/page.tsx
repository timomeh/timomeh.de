import { Metadata } from 'next'
import { Fragment } from 'react'

import { pagePublishedPosts } from '@/data/posts'

import { GlassPill } from '../../../comps/glass-pill'
import { groupPosts, Marker } from './group-posts'
import { ListedPost } from './listed-post'
import { parseSort } from './parse-sort'

export const fetchCache = 'force-cache'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: Props) {
  const year = new Date().getFullYear()
  const sort = parseSort((await searchParams).sort)
  const posts = await pagePublishedPosts(year, { sort })
  const groupedPosts = groupPosts(posts)

  return (
    <div className="space-y-10">
      {groupedPosts.map((group) => (
        <Fragment key={group.marker}>
          <div className="mb-4 flex justify-center">
            <GlassPill>
              <h3>{groupTitle(group.marker, group.posts.length)}</h3>
            </GlassPill>
          </div>
          {group.posts.map((post) => (
            <ListedPost key={post.slug} slug={post.slug} />
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}

function groupTitle(marker: Marker, amount: number) {
  const posts = amount > 1 ? 'posts' : 'post'
  switch (marker) {
    case 'this_week':
      return `${amount} ${posts} this week`
    case 'last_week':
      return `${amount} ${posts} last week`
    case 'this_month':
      return `${amount} ${posts} earlier this month`
    case 'last_month':
      return `${amount} ${posts} last month`
    case 'this_year':
    case 'last_month':
      return `${amount} ${posts} earlier this year`
    default:
      return ''
  }
}
