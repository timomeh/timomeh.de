import { groupBy, range } from 'lodash'

import { Post } from '@/lib/blog'

export function groupPostsByYear(posts: Post[]) {
  const latestPost = posts.at(0)
  const oldestPost = posts.at(-1)

  // just in case, you never know
  if (!latestPost || !oldestPost) {
    return [{ year: new Date().getFullYear(), posts: [] }]
  }

  const latestYear = new Date(latestPost.postedAt).getFullYear()
  const oldestYear = new Date(oldestPost.postedAt).getFullYear()
  const years = range(oldestYear, latestYear! + 1).reverse()

  const postsByYear = groupBy(posts, (post) =>
    new Date(post.postedAt).getFullYear(),
  )

  return years.map((year) => ({
    year,
    posts: postsByYear[year] || [],
  }))
}
