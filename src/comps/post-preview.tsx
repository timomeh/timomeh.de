import Link from 'next/link'

import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'

import { MDX } from './mdx/mdx'
import { PostFullImage } from './post-full-image'
import { PostHeader } from './post-header'
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
      className="group-post-preview relative z-10 block -outline-offset-8!"
    >
      <div className="group/post-preview relative block w-full overflow-hidden pt-10">
        {post.frontmatter.cover && (
          <div className="cover-signal preview-cover-signal absolute inset-0 -z-1">
            <div className="absolute inset-0 z-20 bg-gray-300 mix-blend-hard-light dark:hidden" />
            <PostFullImage
              src={contentAsset('posts', slug, post.frontmatter.cover)}
              alt=""
            />
          </div>
        )}
        <div
          className="bg-grainy absolute inset-0 backdrop-brightness-110 dark:bg-none
            dark:backdrop-brightness-50"
        />
        <div className="mx-auto max-w-2xl px-4">
          {direction === 'older' && (
            <div className="-mt-5 mb-5 group-has-[.preview-cover-signal]/post-preview:-mt-[26px] dark:-mt-5!">
              <div
                className="dark:font-pixel relative inline-block text-sm leading-none font-bold
                  group-has-[.preview-cover-signal]/post-preview:rounded-md
                  group-has-[.preview-cover-signal]/post-preview:p-2
                  group-has-[.preview-cover-signal]/post-preview:backdrop-blur-md
                  group-has-[.preview-cover-signal]/post-preview:backdrop-brightness-125 dark:!p-0
                  dark:!backdrop-blur-none dark:!backdrop-brightness-100"
              >
                <span className="dark:effect-crt-blue text-[#a18570]">
                  Previous Post ↓
                </span>
              </div>
            </div>
          )}
          <article className="relative">
            <Prose>
              <PostHeader slug={slug} />
              <h1 className="font-display mb-8 text-2xl leading-tight font-semibold text-balance sm:text-3xl">
                <MDX content={post.title} inline />
              </h1>
            </Prose>
          </article>
          {direction === 'newer' && (
            <div className="-mt-5 mb-5 group-has-[.preview-cover-signal]/post-preview:-mt-[26px] dark:-mt-5!">
              <div
                className="dark:font-pixel relative inline-block text-sm leading-none font-bold
                  group-has-[.preview-cover-signal]/post-preview:rounded-md
                  group-has-[.preview-cover-signal]/post-preview:p-2
                  group-has-[.preview-cover-signal]/post-preview:backdrop-blur-md
                  group-has-[.preview-cover-signal]/post-preview:backdrop-brightness-125 dark:!p-0
                  dark:!backdrop-blur-none dark:!backdrop-brightness-100"
              >
                <span className="dark:effect-crt-blue text-[#a18570]">
                  Next Post ↑
                </span>
              </div>
            </div>
          )}
        </div>
        {direction === 'older' && (
          <div className="border-beige/50 absolute inset-0 z-10 border-t dark:border-white/20" />
        )}
        {direction === 'newer' && (
          <div className="border-beige/50 absolute inset-0 z-10 border-b dark:border-white/20" />
        )}
      </div>
    </Link>
  )
}
