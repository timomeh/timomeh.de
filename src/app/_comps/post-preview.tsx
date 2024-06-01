import Link from 'next/link'

import { PostHeader } from './post-header'
import { PostImage } from './post-image'
import { getPostBySlug } from '../_data/post.dto'

type Props = {
  slug: string
  dir: 'prev' | 'next'
}

export async function PostPreview({ slug, dir }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) return null

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="relative z-10 block h-40 w-full overflow-hidden bg-black/50 pt-10"
    >
      {post.cover?.url && (
        <div className="absolute inset-0 brightness-50">
          <PostImage src={post.cover.url} alt="" />
        </div>
      )}
      <div className="mx-auto max-w-2xl px-4">
        {dir === 'prev' && (
          <div className="-mt-5 mb-5 font-pixel text-sm font-bold">
            <span className="effect-crt-blue">Previous Post ↓</span>
          </div>
        )}
        <article className="prose prose-invert relative">
          <PostHeader slug={slug} />
        </article>
        {dir === 'next' && (
          <div className="-mt-5 mb-5 font-pixel text-sm font-bold">
            <span className="effect-crt-blue">Next Post ↑</span>
          </div>
        )}
      </div>
    </Link>
  )
}
