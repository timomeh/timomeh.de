import { MDX } from '@/comps/mdx/mdx'
import { Tag } from '@/comps/tag'
import { Post } from '@/lib/blog'

type Props = {
  post: Post
}

export function PostHeader({ post }: Props) {
  return (
    <>
      <div className="mb-1 flex flex-wrap items-center gap-1">
        <div className="font-pixel text-xs leading-none antialiased [font-feature-settings:'ss01']">
          <time className="text-purple-300">
            {post.postedAt.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </time>
          <span className="text-white/50">
            {' | '}
            {post.estMinutes} min reading time
          </span>
        </div>
        {post.tags.map((tag) => (
          <Tag key={tag.slug} color={tag.color} name={tag.name} size="smol" />
        ))}
      </div>
      <h1 className="mb-8 text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
        <MDX content={post.title} inline />
      </h1>
    </>
  )
}
