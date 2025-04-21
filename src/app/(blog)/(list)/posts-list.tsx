import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { GlassPill } from '@/comps/glass-pill'
import { Post } from '@/data/cms'
import {
  listPostYears,
  listPublishedPosts,
  pagePublishedPosts,
} from '@/data/posts'
import { getTag } from '@/data/tags'
import { isMonthAgo, isWeekAgo, isYearAgo } from '@/lib/date'
import { pluralizePosts } from '@/lib/plurals'

import { ListedPost } from './listed-post'

type Props = {
  sort?: 'asc' | 'desc'
  year?: number
  tagSlug?: string
}

export async function PostsList({ sort = 'desc', year, tagSlug }: Props) {
  if (tagSlug) {
    const tag = await getTag(tagSlug)
    if (!tag) {
      notFound()
    }

    const posts = await listPublishedPosts({ tag: tagSlug, sort })

    return (
      <div className="space-y-10">
        <div className="mb-4 flex justify-center">
          <GlassPill>
            <h3>
              {pluralizePosts(posts.length)} in {tag.title}
            </h3>
          </GlassPill>
        </div>
        {posts.map((post) => (
          <ListedPost slug={post.slug} key={post.slug} />
        ))}
      </div>
    )
  }

  if (year) {
    const postYears = await listPostYears()
    const postYear = postYears.find((postYear) => postYear.year === year)

    if (!postYear) {
      notFound()
    }

    const posts = await pagePublishedPosts(postYear.year, { sort })

    return (
      <div className="space-y-10">
        <div className="mb-4 flex justify-center">
          <GlassPill>
            <h3>
              {pluralizePosts(posts.length)} in {postYear.year}
            </h3>
          </GlassPill>
        </div>
        {posts.map((post) => (
          <ListedPost slug={post.slug} key={post.slug} />
        ))}
      </div>
    )
  }

  const postYears = await listPostYears()
  const postYear = postYears[0]
  const posts = await pagePublishedPosts(postYear.year, { sort })

  const groupedPosts = groupPosts(posts)

  return (
    <div className="space-y-10">
      {groupedPosts.map((group) => (
        <Fragment key={group.marker}>
          <div className="mb-4 flex justify-center">
            <GlassPill>
              <h3>
                {pluralizePosts(group.posts.length)} {group.title}
              </h3>
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

function groupPosts(posts: Post[]) {
  return posts.reduce((groups, post) => {
    const date = post.publishedAt
    const currentGroup = groups.at(-1)

    if (isWeekAgo(date, 0)) {
      if (currentGroup?.marker === 'this_week') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'this_week', posts: [post], title: 'this week' })
      }

      return groups
    }

    if (isWeekAgo(date, 1)) {
      if (currentGroup?.marker === 'last_week') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'last_week', posts: [post], title: 'last week' })
      }

      return groups
    }

    if (isMonthAgo(date, 0)) {
      if (currentGroup?.marker === 'this_month') {
        currentGroup.posts.push(post)
      } else {
        groups.push({
          marker: 'this_month',
          posts: [post],
          title: 'earlier this month',
        })
      }

      return groups
    }

    if (isMonthAgo(date, 1)) {
      if (currentGroup?.marker === 'last_month') {
        currentGroup.posts.push(post)
      } else {
        groups.push({
          marker: 'last_month',
          posts: [post],
          title: 'last month',
        })
      }

      return groups
    }

    if (isYearAgo(date, 0)) {
      if (currentGroup?.marker === 'this_year') {
        currentGroup.posts.push(post)
      } else {
        groups.push({
          marker: 'this_year',
          posts: [post],
          title: 'earlier this year',
        })
      }

      return groups
    }

    return groups
  }, [] as Group[])
}

type Group = { marker: Marker; posts: Post[]; title: string }

type Marker =
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
