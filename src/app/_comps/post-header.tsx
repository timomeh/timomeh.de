import { MDX } from '@/app/_comps/mdx/mdx'
import { PostTag } from '@/app/_comps/post-tag'
import { getPostBySlug } from '@/app/_data/post.dto'

type Props = {
  slug: string
}

export async function PostHeader({ slug }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) return null

  return (
    <>
      <div className="mb-1 flex flex-wrap items-center gap-1">
        <div className="font-pixel text-xs leading-none antialiased [font-feature-settings:'ss01']">
          {post.publishedAt && (
            <time className="text-purple-300">
              {new Date(post.publishedAt).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </time>
          )}
          {!post.publishedAt && (
            <span className="text-purple-300">unpublished</span>
          )}
          <span className="text-white/50">
            {' | '}
            {post.readingTime} min reading time
          </span>
        </div>
        {post.categories?.map((category) => (
          <PostTag key={category.id} slug={category.slug} size="smol" />
        ))}
      </div>
      <h1 className="mb-8 text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
        <MDX content={post.title} inline />
      </h1>
    </>
  )
}
