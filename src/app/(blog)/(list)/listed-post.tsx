import Link from 'next/link'
import React from 'react'

import { Card } from '@/comps/card'
import { ConditionalViewTransition } from '@/comps/ConditionalViewTransition'
import { Anchor } from '@/comps/mdx/anchor'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { PostPreviewImage } from '@/comps/post-preview-image'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'

type Props = {
  slug: string
}

export async function ListedPost({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <article
      lang={post.meta.lang?.split('_')[0]}
      id={slug}
      className="w-full max-w-[720px]"
    >
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
        <ConditionalViewTransition name={`${post.slug}-post`}>
          <div className="wrapper px-4 py-6 sm:px-6 sm:py-10">
            <Prose>
              <PostHeader slug={post.slug} linked />
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
        </ConditionalViewTransition>
      </Card>
    </article>
  )
}
