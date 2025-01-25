import { Anchor } from '@/comps/mdx/anchor'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { PostPreviewImage } from '@/comps/post-preview-image'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import Link from 'next/link'
import React from 'react'

type Props = {
  slug: string
}

export async function ListedPost({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <article
      lang={post.meta.lang?.split('_')[0]}
      className="relative isolate overflow-hidden pb-24"
    >
      <div className="bg-beige/50 relative z-10 h-px w-full dark:bg-white/10" />
      {post.frontmatter.cover ? (
        <>
          <div className="absolute top-[-63px] right-0 left-0 overflow-hidden">
            <PostPreviewImage
              src={contentAsset('posts', slug, post.frontmatter.cover)}
              alt=""
            />
          </div>
          <div className="aspect-5/1 sm:h-[200px]" />
        </>
      ) : (
        <div className="h-24" />
      )}
      <div className="animate-fade-in relative mx-auto max-w-2xl px-4">
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
                    <Link href={`/posts/${post.slug}`} className="no-underline">
                      {props.children}
                    </Link>
                  </h1>
                )
              },
            }}
            assetPrefix={contentAsset('posts', post.slug, '')}
            content={post.content}
            readMorePath={`/posts/${post.slug}`}
            scope={post.slug}
          />
        </Prose>
      </div>
    </article>
  )
}
