import { isMonthAgo, isWeekAgo, isYearAgo } from './date'

export function groupPosts<T extends { publishedAt: Date }>(posts: T[]) {
  return posts.reduce((groups, post) => {
    const date = post.publishedAt
    const currentGroup = groups.at(-1)

    if (isWeekAgo(date, 0)) {
      if (currentGroup?.marker === 'this_week') {
        currentGroup.posts.push(post)
        currentGroup.title = `${posts.length} posts this week`
      } else {
        groups.push({
          marker: 'this_week',
          posts: [post],
          title: '1 post this week',
        })
      }

      return groups
    }

    if (isWeekAgo(date, 1)) {
      if (currentGroup?.marker === 'last_week') {
        currentGroup.posts.push(post)
        currentGroup.title = `${posts.length} posts last week`
      } else {
        groups.push({
          marker: 'last_week',
          posts: [post],
          title: '1 post last week',
        })
      }

      return groups
    }

    if (isMonthAgo(date, 0)) {
      if (currentGroup?.marker === 'this_month') {
        currentGroup.posts.push(post)
        currentGroup.title = `${posts.length} posts earlier this month`
      } else {
        groups.push({
          marker: 'this_month',
          posts: [post],
          title: '1 post earlier this month',
        })
      }

      return groups
    }

    if (isMonthAgo(date, 1) && isYearAgo(date, 0)) {
      if (currentGroup?.marker === 'last_month') {
        currentGroup.posts.push(post)
        currentGroup.title = `${posts.length} posts last month`
      } else {
        groups.push({
          marker: 'last_month',
          posts: [post],
          title: '1 post last month',
        })
      }

      return groups
    }

    if (isYearAgo(date, 0)) {
      if (currentGroup?.marker === 'this_year') {
        currentGroup.posts.push(post)
        currentGroup.title = `${currentGroup.posts.length} posts earlier this year`
      } else {
        groups.push({
          marker: 'this_year',
          posts: [post],
          title: `1 post earlier this year`,
        })
      }

      return groups
    }

    if (isYearAgo(date, 1)) {
      if (currentGroup?.marker === 'last_year') {
        currentGroup.posts.push(post)
      } else {
        groups.push({
          marker: 'last_year',
          posts: [post],
          title: 'some posts from last year',
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
  | 'last_year'
