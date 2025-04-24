import Link from 'next/link'
import React from 'react'

import { Card } from '@/comps/card'
import { FadeInImage } from '@/comps/fade-in-image'
import { Anchor } from '@/comps/mdx/anchor'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'
import { getPlaceholder } from '@/lib/placeholder'

type Props = {
  slug: string
}

export async function ListedPost({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  const [lightCover, darkCover] = await Promise.all([
    post.frontmatter.lightCover
      ? await getPlaceholder(
          contentAsset('posts', slug, post.frontmatter.lightCover),
        )
      : null,
    post.frontmatter.darkCover
      ? await getPlaceholder(
          contentAsset('posts', slug, post.frontmatter.darkCover),
        )
      : null,
  ])

  return (
    <article lang={post.meta.lang?.split('_')[0]} id={slug}>
      <Card>
        {post?.frontmatter.lightBgColor && (
          <div
            style={{ background: post?.frontmatter.lightBgColor }}
            className="absolute inset-0 -z-10 mix-blend-multiply dark:hidden"
          />
        )}
        {post?.frontmatter.darkBgColor && (
          <div
            style={{ background: post?.frontmatter.darkBgColor }}
            className="absolute inset-0 -z-10 hidden mix-blend-exclusion dark:block"
          />
        )}
        {lightCover && (
          <div
            data-has-dark={!!darkCover}
            className="relative isolate flex h-auto max-h-[400px] w-full items-end overflow-hidden
              [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
              mix-blend-darken dark:data-[has-dark=true]:hidden"
          >
            <FadeInImage
              alt=""
              src={lightCover.img.src}
              width={lightCover.img.width}
              height={lightCover.img.height}
            />
            <div
              className="absolute inset-0 -z-10 h-full w-full scale-110 transform blur-2xl filter"
              style={lightCover.css}
            />
          </div>
        )}
        {darkCover && (
          <div
            className="relative isolate hidden h-auto max-h-[400px] w-full items-end overflow-hidden
              [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
              mix-blend-lighten dark:flex"
          >
            <FadeInImage
              alt=""
              src={darkCover.img.src}
              width={darkCover.img.width}
              height={darkCover.img.height}
            />
            <div
              className="absolute inset-0 -z-10 h-full w-full scale-110 transform blur-2xl filter"
              style={darkCover.css}
            />
          </div>
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
                  post.frontmatter.readingTime,
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
