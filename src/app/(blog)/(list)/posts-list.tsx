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
        <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-8">
          <div className="text-md relative mb-4 flex justify-center text-center">
            <h3 className="font-mono font-medium text-balance">
              🏷️ Posts tagged {tag.title}
            </h3>
          </div>
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
        <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-8">
          <div className="text-md relative mb-4 flex justify-center text-center">
            <h3 className="font-mono font-medium text-balance">
              📅 Posts from {postYear.year}
            </h3>
          </div>
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
