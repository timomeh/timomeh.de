import Link from 'next/link'

import { PostHeader } from '@/app/(posts)/posts/[slug]/post-header'
import { PostImage } from '@/app/@backdrop/posts/[slug]/post-image'
import { getSurroundingPosts } from '@/lib/blog'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const { prev } = await getSurroundingPosts(params.slug)
  if (!prev) {
    return null
  }

  return (
    <Link
      href={`/posts/${prev.slug}`}
      className="relative block w-full overflow-hidden bg-black/50 pt-10 opacity-60
        transition-opacity hover:opacity-100"
    >
      {prev.meta.cover_image && (
        <div className="absolute inset-0 brightness-50">
          <PostImage src={prev.meta.cover_image} />
        </div>
      )}
      <div className="mx-auto max-w-2xl px-4">
        <div className="-mt-5 mb-5 font-pixel text-sm font-bold">
          <span className="effect-crt-blue">Previous Post ↓</span>
        </div>
        <article className="prose prose-invert relative">
          <PostHeader post={prev} />
        </article>
      </div>
    </Link>
  )
}
