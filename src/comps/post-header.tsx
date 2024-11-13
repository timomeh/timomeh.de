import { PostTag } from '@/comps/post-tag'
import { getPost } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'

type Props = {
  slug: string
}

export async function PostHeader({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <>
      <div className="mb-1 flex flex-wrap items-center gap-1">
        <div className="font-pixel text-xs leading-none antialiased [font-feature-settings:'ss01']">
          <time className="text-purple-300">
            {new Date(post.publishedAt).toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </time>
          <span className="text-white/70">
            {' | '}
            {formatReadingTime(
              post.content,
              post.frontmatter.readingTime,
              'reading time',
            )}
          </span>
        </div>
        {post.tags.map((tag) => (
          <PostTag key={tag} slug={tag} size="smol" />
        ))}
      </div>
    </>
  )
}
