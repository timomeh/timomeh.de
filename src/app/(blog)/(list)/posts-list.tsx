import { notFound } from 'next/navigation'
import { Fragment } from 'react'

import { GlassPill } from '@/comps/glass-pill'
import { listPublishedPostsByTag } from '@/data/posts'
import { getTagBySlug } from '@/data/tags'
import { isMonthAgo, isWeekAgo, isYearAgo } from '@/lib/date'
import { pluralizePosts } from '@/lib/plurals'
import type { Post, Short } from '../../../data/cms'
import { listEntriesByYear, listEntryYears } from '../../../data/entries'
import { ListedPost } from './listed-post'
import { ShortsTimeline } from './shorts-timeline'

type Props = {
  sort?: 'asc' | 'desc'
  year?: number
  tagSlug?: string
}

export async function PostsList({ sort = 'desc', year, tagSlug }: Props) {
  if (tagSlug) {
    const tag = await getTagBySlug(tagSlug)
    if (!tag) {
      notFound()
    }

    const posts = await listPublishedPostsByTag(tag.id, { sort })

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
    const entryYears = await listEntryYears()
    const entryYear = entryYears.find((entryYear) => entryYear.year === year)

    if (!entryYear) {
      notFound()
    }

    const entries = await listEntriesByYear(entryYear.year, { sort })

    return (
      <div className="space-y-10">
        <div className="mb-4 flex justify-center">
          <GlassPill>
            <h3>
              {pluralizePosts(entries.length)} in {entryYear.year}
            </h3>
          </GlassPill>
        </div>
        {timelineify(entries).map((entry) =>
          entry.type === 'post' ? (
            <ListedPost slug={entry.post.slug} key={entry.post.slug} />
          ) : (
            <ShortsTimeline key={entry.shorts[0].id} shorts={entry.shorts} />
          ),
        )}
      </div>
    )
  }

  const entryYears = await listEntryYears()
  const entryYear = entryYears[0]
  const entries = entryYear
    ? await listEntriesByYear(entryYear.year, { sort })
    : []

  const groupedEntries = groupEntries(entries)

  return (
    <div className="space-y-10">
      {groupedEntries.map((group) => (
        <Fragment key={group.marker}>
          <div className="mb-4 flex justify-center">
            <GlassPill>
              <h3>
                {pluralizePosts(group.posts.length)} {group.title}
              </h3>
            </GlassPill>
          </div>
          {timelineify(group.posts).map((entry) =>
            entry.type === 'post' ? (
              <ListedPost slug={entry.post.slug} key={entry.post.slug} />
            ) : (
              <ShortsTimeline key={entry.shorts[0].id} shorts={entry.shorts} />
            ),
          )}
        </Fragment>
      ))}
    </div>
  )
}

function timelineify<T extends { [slug: string]: unknown }>(entries: T[]) {
  const out: (
    | { type: 'post'; post: Post }
    | { type: 'short-group'; shorts: Short[] }
  )[] = []
  let group: null | Short[] = null

  for (const entry of entries) {
    const isPost = 'slug' in entry

    if (isPost) {
      if (group) {
        out.push({ type: 'short-group', shorts: group })
        group = null
      }
      out.push({ type: 'post', post: entry as unknown as Post })
    } else {
      if (!group) group = []
      group.push(entry as unknown as Short)
    }
  }

  if (group) {
    out.push({ type: 'short-group', shorts: group })
  }

  return out
}

function groupEntries<T extends { publishedAt: Date }>(posts: T[]) {
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
  }, [] as Group<T>[])
}

type Group<T> = { marker: Marker; posts: T[]; title: string }

type Marker =
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
