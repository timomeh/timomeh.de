import {
  ListPostsByTag,
  ListPostsByYear,
  ListPostsForCurrentYear,
} from './data'
import { ListedPost } from './listed-post'

type Props = {
  sort?: 'asc' | 'desc'
  year?: number
  tagSlug?: string
}

export async function PostsList({ sort = 'desc', year, tagSlug }: Props) {
  if (tagSlug) {
    const { tag, posts } = await ListPostsByTag.invoke(tagSlug, sort)

    return (
      <div>
        <div className="relative mb-4 flex justify-center">
          <h3>Tagged {tag.title}</h3>
        </div>
        {posts.map((post) => (
          <div className="relative" key={post.slug}>
            <ListedPost slug={post.slug} />
          </div>
        ))}
      </div>
    )
  }

  if (year) {
    const { postYear, posts } = await ListPostsByYear.invoke(year, sort)

    return (
      <div>
        <div className="relative mb-4 flex justify-center">
          <h3>Year {postYear.year}</h3>
        </div>
        {posts.map((post) => (
          <div className="relative" key={post.slug}>
            <ListedPost slug={post.slug} />
          </div>
        ))}
      </div>
    )
  }

  const { posts } = await ListPostsForCurrentYear.invoke(sort)

  return (
    <div>
      {posts.map((post) => (
        <div className="relative" key={post.slug}>
          <ListedPost slug={post.slug} />
        </div>
      ))}
    </div>
  )
}
