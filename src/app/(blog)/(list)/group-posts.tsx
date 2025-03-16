import { Post } from '@/data/cms'
import { isMonthAgo, isWeekAgo, isYearAgo } from '@/lib/date'

export function groupPosts(posts: Post[]) {
  return posts.reduce((groups, post) => {
    const date = post.publishedAt
    const currentGroup = groups.at(-1)

    if (isWeekAgo(date, 0)) {
      if (currentGroup?.marker === 'this_week') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'this_week', posts: [post] })
      }

      return groups
    }

    if (isWeekAgo(date, 1)) {
      if (currentGroup?.marker === 'last_week') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'last_week', posts: [post] })
      }

      return groups
    }

    if (isMonthAgo(date, 0)) {
      if (currentGroup?.marker === 'this_month') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'this_month', posts: [post] })
      }

      return groups
    }

    if (isMonthAgo(date, 1)) {
      if (currentGroup?.marker === 'last_month') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'last_month', posts: [post] })
      }

      return groups
    }

    if (isYearAgo(date, 0)) {
      if (currentGroup?.marker === 'this_year') {
        currentGroup.posts.push(post)
      } else {
        groups.push({ marker: 'this_year', posts: [post] })
      }

      return groups
    }

    if (currentGroup?.marker === 'last_year') {
      currentGroup.posts.push(post)
    } else {
      groups.push({ marker: 'last_year', posts: [post] })
    }

    return groups
  }, [] as Group[])
}

type Group = { marker: Marker; posts: Post[] }

export type Marker =
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year'
