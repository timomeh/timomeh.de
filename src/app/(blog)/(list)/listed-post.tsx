import Link from 'next/link'
import React, { Suspense } from 'react'

import { Card } from '@/comps/card'
import { FadeInImage } from '@/comps/fade-in-image'
import { Anchor } from '@/comps/mdx/anchor'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPostBySlug } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'
import { getPlaceholder } from '@/lib/placeholder'

type Props = {
  slug: string
}

export async function ListedPost({ slug }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) return null

  return (
    <article lang={post.metaLang?.split('_')[0]} id={slug}>
      <Card>
        {post?.lightBgColor && (
          <div
            style={{ background: post.lightBgColor }}
            className="absolute inset-0 -z-10 rounded-xl mix-blend-multiply
              dark:hidden"
          />
        )}
        {post?.darkBgColor && (
          <div
            style={{ background: post.darkBgColor }}
            className="absolute inset-0 -z-10 hidden rounded-xl
              mix-blend-exclusion dark:block"
          />
        )}
        {(post.darkCover || post.lightCover) && (
          <Suspense fallback={<div className="aspect-[3/2] max-h-[400px]" />}>
            <Cover
              slug={post.slug}
              light={post.lightCover}
              dark={post.darkCover}
            />
          </Suspense>
        )}
        <div className="p-4 sm:p-6 md:p-8">
          <Prose>
            <Link
              href={`/posts/${post.slug}`}
              className="not-prose inline-flex"
            >
              <PostHeader
                publishedAt={post.publishedAt}
                readingTime={formatReadingTime(
                  post.content,
                  post.readingTime,
                  'read',
                )}
              />
            </Link>
            <MDX
              components={{
                h1: (props) => {
                  let hasLink = false

                  React.Children.forEach(props.children, (child) => {
                    hasLink = child.type === Anchor
                  })

                  if (hasLink) return <h1>{props.children}</h1>

                  return (
                    <h1>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="no-underline"
                      >
                        {props.children}
                      </Link>
                    </h1>
                  )
                },
              }}
              cacheTags={['mdx-type:listed-post', `mdx-post:${post.slug}`]}
              cacheKey={`listed-post-${post.slug}`}
              assetPrefix={contentAsset('posts', post.slug, '')}
              content={post.content}
              readMorePath={`/posts/${post.slug}`}
              scope={post.slug}
            />
          </Prose>
        </div>
      </Card>
    </article>
  )
}

type CoverProps = {
  light: string | null
  dark: string | null
  slug: string
}

export async function Cover({ light, dark, slug }: CoverProps) {
  const [lightCover, darkCover] = await Promise.all([
    light ? await getPlaceholder(contentAsset('posts', slug, light)) : null,
    dark ? await getPlaceholder(contentAsset('posts', slug, dark)) : null,
  ])

  return (
    <div>
      {lightCover && (
        <div
          data-has-dark={!!darkCover}
          className="relative isolate flex h-auto max-h-[400px] w-full items-end
            overflow-hidden rounded-t-xl
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            mix-blend-darken dark:data-[has-dark=true]:hidden"
        >
          <FadeInImage
            alt=""
            sizes="(max-width: 640px) 100vw, (max-width: 810px) 80vw, 700px"
            src={lightCover.img.src}
            width={lightCover.img.width}
            height={lightCover.img.height}
          />
          <div
            className="absolute inset-0 -z-10 h-full w-full scale-110 transform
              blur-2xl filter"
            style={lightCover.css}
          />
        </div>
      )}
      {darkCover && (
        <div
          className="relative isolate hidden h-auto max-h-[400px] w-full
            items-end overflow-hidden rounded-t-xl
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            mix-blend-lighten dark:flex"
        >
          <FadeInImage
            alt=""
            sizes="(max-width: 640px) 100vw, (max-width: 810px) 80vw, 700px"
            src={darkCover.img.src}
            width={darkCover.img.width}
            height={darkCover.img.height}
          />
          <div
            className="absolute inset-0 -z-10 h-full w-full scale-110 transform
              blur-2xl filter"
            style={darkCover.css}
          />
        </div>
      )}
    </div>
  )
}
