import Link from 'next/link'
import React, { Suspense } from 'react'

import { PostEyebrow } from '@/app/(blog)/post-eyebrow'
import { FadeInImage } from '@/comps/fade-in-image'
import { Lightbox } from '@/comps/lightbox'
import { Anchor } from '@/comps/mdx/anchor'
import { MDX } from '@/comps/mdx/mdx'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPlaceholder } from '@/lib/placeholder'

import { ListedPost } from './data'

export async function PostPreview({
  post,
}: {
  post: Omit<ListedPost, 'type'>
}) {
  return (
    <article
      lang={post.metaLang?.split('_')[0]}
      id={post.slug}
      className="relative border-b border-black/10 dark:border-white/10"
    >
      {post.lightBgColor && (
        <div
          style={{ background: post.lightBgColor }}
          className="absolute inset-0 -z-10 mix-blend-multiply dark:hidden"
        />
      )}
      {post.darkBgColor && (
        <div
          style={{ background: post.darkBgColor }}
          className="
            absolute inset-0 -z-10 hidden mix-blend-exclusion
            dark:block
          "
        />
      )}
      {(post.darkCover || post.lightCover) && (
        <div className="-mb-4 sm:-mb-6 md:-mb-12">
          <Suspense fallback={<div className="aspect-3/2 max-h-[400px]" />}>
            <Cover
              slug={post.slug}
              light={post.lightCover}
              dark={post.darkCover}
            />
          </Suspense>
        </div>
      )}
      <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
        <div className="mb-3">
          <PostEyebrow post={post} linked />
        </div>
        <Prose>
          <Lightbox>
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
                        className="no-underline hover:underline"
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
          </Lightbox>
        </Prose>
      </div>
    </article>
  )
}

async function Cover({
  light,
  dark,
  slug,
}: {
  light: string | null
  dark: string | null
  slug: string
}) {
  const [lightCover, darkCover] = await Promise.all([
    light ? await getPlaceholder(contentAsset('posts', slug, light)) : null,
    dark ? await getPlaceholder(contentAsset('posts', slug, dark)) : null,
  ])

  return (
    <div className="select-none">
      {lightCover && (
        <div
          data-has-dark={!!darkCover}
          className="
            relative isolate mx-auto flex h-auto max-h-[400px] w-full max-w-2xl
            items-end overflow-hidden rounded-t-xl
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            [mask-composite:intersect] mix-blend-darken
            lg:[mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%),linear-gradient(to_left,#000_95%,transparent_100%),linear-gradient(to_right,#000_95%,transparent_100%)]
            dark:data-[has-dark=true]:hidden
          "
        >
          <FadeInImage
            alt=""
            sizes="(max-width: 640px) 100vw, (max-width: 810px) 80vw, 700px"
            src={lightCover.img.src}
            width={lightCover.img.width}
            height={lightCover.img.height}
          />
          <div
            className="
              absolute inset-0 -z-10 h-full w-full scale-110 transform blur-2xl
              filter
            "
            style={lightCover.css}
          />
        </div>
      )}
      {darkCover && (
        <div
          className="
            relative isolate mx-auto hidden h-auto max-h-[400px] w-full
            max-w-2xl items-end overflow-hidden rounded-t-xl
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            [mask-composite:intersect] mix-blend-lighten
            lg:[mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%),linear-gradient(to_left,#000_95%,transparent_100%),linear-gradient(to_right,#000_95%,transparent_100%)]
            dark:flex
          "
        >
          <FadeInImage
            alt=""
            sizes="(max-width: 640px) 100vw, (max-width: 810px) 80vw, 700px"
            src={darkCover.img.src}
            width={darkCover.img.width}
            height={darkCover.img.height}
          />
          <div
            className="
              absolute inset-0 -z-10 h-full w-full scale-110 transform blur-2xl
              filter
            "
            style={darkCover.css}
          />
        </div>
      )}
    </div>
  )
}
