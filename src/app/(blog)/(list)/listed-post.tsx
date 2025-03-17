import { CircleArrowUp } from 'lucide-react'
import Link from 'next/link'
import React, { unstable_ViewTransition as ViewTransition } from 'react'

import { Card } from '@/comps/card'
import { GlassPill } from '@/comps/glass-pill'
import { Anchor } from '@/comps/mdx/anchor'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { PostPreviewImage } from '@/comps/post-preview-image'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'

import { AppearForFragment } from './appear-for-fragment'

type Props = {
  slug: string
  continueMarker?: boolean
}

export async function ListedPost({ slug, continueMarker }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <article
      lang={post.meta.lang?.split('_')[0]}
      id={slug}
      className="w-full max-w-[720px]"
    >
      {continueMarker && (
        <AppearForFragment slug={slug}>
          <div className="flex justify-center py-4">
            <div className="relative">
              <div className="relative z-10">
                <GlassPill>
                  <span>continue in {post.publishedAt.getFullYear()}</span>
                </GlassPill>
              </div>
              <Link
                href={`/in/${post.publishedAt.getFullYear()}`}
                className="absolute top-0 left-full -ml-7 opacity-70 transition hover:translate-x-1
                  hover:opacity-100"
              >
                <GlassPill>
                  <div className="flex items-center pl-5">
                    <span>up</span>
                    <CircleArrowUp className="-mr-1.5 ml-1.5 size-4" />
                  </div>
                </GlassPill>
              </Link>
            </div>
          </div>
        </AppearForFragment>
      )}
      <Card>
        {post.frontmatter.cover && (
          <>
            <div className="absolute inset-x-0 top-0 z-0 overflow-hidden opacity-75">
              <PostPreviewImage
                src={contentAsset('posts', slug, post.frontmatter.cover)}
                alt=""
              />
            </div>
            <div className="aspect-4/1 w-full sm:max-h-[200px]" />
          </>
        )}
        <div className="wrapper px-4 py-6 sm:px-6 sm:py-10">
          <Prose>
            <ViewTransition name={`${post.slug}-post-header`}>
              <PostHeader slug={post.slug} linked />
            </ViewTransition>
            <ViewTransition name={`${post.slug}-post-content`}>
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
            </ViewTransition>
          </Prose>
        </div>
      </Card>
    </article>
  )
}
