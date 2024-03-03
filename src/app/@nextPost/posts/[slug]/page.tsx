import Link from 'next/link'

import { PostHeader } from '@/app/(posts)/posts/[slug]/post-header'
import { PostImage } from '@/app/@backdrop/posts/[slug]/post-image'
import { ScrollFade } from '@/comps/scroll-fade'
import { getSurroundingPosts } from '@/lib/blog'

import { ScrollAway } from './scroll-away'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const { next } = await getSurroundingPosts(params.slug)
  if (!next) {
    return null
  }

  return (
    <ScrollAway>
      <ScrollFade pos="top">
        <Link
          href={`/posts/${next.slug}`}
          className="relative z-10 block w-full overflow-hidden bg-black/50 pt-10"
        >
          {next.meta.cover_image && (
            <div className="absolute inset-0 brightness-50">
              <PostImage src={next.meta.cover_image} />
            </div>
          )}
          <div className="mx-auto max-w-2xl px-4">
            <article className="prose prose-invert relative">
              <PostHeader post={next} />
            </article>
            <div className="-mt-5 mb-5 font-pixel text-sm font-bold">
              <span className="effect-crt-blue">Next Post ↑</span>
            </div>
          </div>
        </Link>
      </ScrollFade>
    </ScrollAway>
  )
}
