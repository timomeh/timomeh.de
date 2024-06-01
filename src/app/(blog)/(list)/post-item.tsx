import Link from 'next/link'

import { MDX } from '@/app/_comps/mdx/mdx'
import { PostTag } from '@/app/_comps/post-tag'
import { getPostBySlug } from '@/app/_data/post.dto'

type Props = {
  slug: string
}

export async function PostItem({ slug }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) return null

  return (
    <article key={post.id} className="group/post mb-6 sm:mb-4 sm:flex">
      <div>
        <div className="flex items-center gap-1">
          <div
            className="font-pixel text-2xs leading-none antialiased [font-feature-settings:'ss01']
              sm:text-xs"
          >
            <time className="text-purple-300">
              {new Date(post.publishedAt!).toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
              })}
            </time>
            <span className="text-white/50">
              {' | '}
              {post.readingTime} min
            </span>
          </div>
          {post.categories?.map((category) => (
            <PostTag key={category.id} slug={category.slug} size="smol" />
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
