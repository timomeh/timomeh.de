import { PostTag } from '@/comps/post-tag'
import { getPost } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'
import Link from 'next/link'

type Props = {
  slug: string
  linked?: boolean
}

export async function PostHeader({ slug, linked }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  const meta = (
    <>
      <time className="text-purple-600 dark:text-purple-300">
        {new Date(post.publishedAt).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}
      </time>
      <span className="text-gray-500 dark:text-white/70">
        {' | '}
        {formatReadingTime(
          post.content,
          post.frontmatter.readingTime,
          'reading time',
        )}
      </span>
    </>
  )

  return (
    <>
      <div className="mb-1 flex flex-wrap items-center gap-1">
        <div
          className="font-display dark:font-pixel text-sm leading-none font-medium dark:text-xs
            dark:font-normal"
        >
          {linked ? (
            <Link href={`/posts/${post.slug}`} className="no-underline">
              {meta}
            </Link>
          ) : (
            meta
          )}
        </div>
        {post.tags.map((tag) => (
          <PostTag key={tag} slug={tag} size="smol" />
        ))}
      </div>
    </>
  )
}
