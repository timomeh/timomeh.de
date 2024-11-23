import Link from 'next/link'

import { PostHeader } from './post-header'
import { PostFullImage } from './post-full-image'
import { getPost } from '@/data/posts'
import { contentAsset } from '@/data/cms'
import { MDX } from './mdx/mdx'
import { Prose } from './prose'

type Props = {
  slug: string
  direction: 'older' | 'newer'
}

export async function PostPreview({ slug, direction }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="relative z-10 block !-outline-offset-8"
    >
      <div className="relative block w-full overflow-hidden bg-black/50 pt-10">
        {post.frontmatter.cover && (
          <div className="absolute inset-0 -z-[1] brightness-50">
            <PostFullImage
              src={contentAsset('posts', slug, post.frontmatter.cover)}
              alt=""
            />
          </div>
        )}
        <div className="mx-auto max-w-2xl px-4">
          {direction === 'older' && (
            <div className="-mt-5 mb-5 font-pixel text-sm font-bold">
              <span className="effect-crt-blue">Previous Post ↓</span>
            </div>
          )}
          <article className="relative">
            <Prose>
              <PostHeader slug={slug} />
              <h1 className="mb-8 text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
                <MDX content={post.title} inline />
              </h1>
            </Prose>
          </article>
          {direction === 'newer' && (
            <div className="-mt-5 mb-5 font-pixel text-sm font-bold">
              <span className="effect-crt-blue">Next Post ↑</span>
            </div>
          )}
        </div>
        {direction === 'older' && (
          <div className="absolute inset-0 z-10 border-t border-white/20" />
        )}
        {direction === 'newer' && (
          <div className="absolute inset-0 z-10 border-b border-white/20" />
        )}
      </div>
    </Link>
  )
}
