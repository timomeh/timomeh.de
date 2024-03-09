import Link from 'next/link'

import { getPost } from '@/lib/blog'

import { PostHeader } from './post-header'
import { PostImage } from './post-image'

type Props = {
  slug: string
  dir: 'prev' | 'next'
}

export async function PostPreview({ slug, dir }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="relative z-10 block w-full overflow-hidden bg-black/50 pt-10"
    >
      {post.meta.cover_image && (
        <div className="absolute inset-0 brightness-50">
          <PostImage src={post.meta.cover_image} />
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
