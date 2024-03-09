import Link from 'next/link'

import { MDX } from '@/comps/mdx/mdx'
import { PostTag } from '@/comps/post-tag'
import { getPost } from '@/lib/blog'

type Props = {
  slug: string
}

export async function PostItem({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <article key={post.number} className="group/post mb-6 sm:mb-4 sm:flex">
      <div>
        <div className="flex items-center gap-1">
          <div
            className="font-pixel text-2xs leading-none antialiased [font-feature-settings:'ss01']
              sm:text-xs"
          >
            <time className="text-purple-300">
              {new Date(post.postedAt).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
              })}
            </time>
            <span className="text-white/50">
              {' | '}
              {post.estMinutes} min
            </span>
          </div>
          {post.tags.map((tag) => (
            <PostTag key={tag.slug} slug={tag.slug} size="smol" />
          ))}
        </div>
        <h3 className="mt-1 text-balance font-display font-medium leading-snug">
          <Link href={`/posts/${post.slug}`}>
            <MDX content={post.title} inline />
          </Link>
        </h3>
      </div>
    </article>
  )
}
