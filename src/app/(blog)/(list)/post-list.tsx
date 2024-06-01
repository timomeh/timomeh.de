import {
  ShortPostDto,
  listPosts,
  listPostsByCategory,
} from '@/app/_data/post.dto'
import { PostItem } from './post-item'
import { groupBy, range } from 'lodash'

type Props = {
  tag?: string
}

export async function PostList({ tag }: Props) {
  const posts = tag ? await listPostsByCategory(tag) : await listPosts()
  const postsByYear = groupByYear(posts)

  return (
    <>
      {postsByYear.map(({ year, posts }) => (
        <div key={year} className="mt-10">
          <h2 className="effect-crt-blue font-pixel text-2xl font-bold leading-none">
            {year}
          </h2>
          <div className="h-4" />
          {posts.length === 0 && (
            <div className="font-display font-semibold text-white/50">
              No posts this year
            </div>
          )}
          {posts.map((post) => (
            <PostItem key={post.id} slug={post.slug} />
          ))}
        </div>
      ))}
    </>
  )
}

function groupByYear(posts: ShortPostDto[]) {
  const latest = posts.at(0)
  const oldest = posts.at(-1)

  // just in case the world explodes, you never know
  if (!latest || !oldest) {
    return [{ year: new Date().getFullYear(), posts: [] }]
  }

  const latestYear = new Date(latest.publishedAt || Date.now()).getFullYear()
  const oldestYear = new Date(oldest.publishedAt || Date.now()).getFullYear()
  const years = range(oldestYear, latestYear! + 1).reverse()

  const byYear = groupBy(posts, (post) =>
    new Date(post.publishedAt || Date.now()).getFullYear(),
  )

  const list = years.map((year) => ({
    year,
    posts: byYear[year] || [],
  }))

  return list
}
