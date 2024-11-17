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
      className="relative overflow-hidden border-t border-white/10 pb-24"
    >
      {post.frontmatter.cover ? (
        <>
          <div className="absolute left-0 right-0 top-[-63px]">
            <PostPreviewImage
              src={contentAsset('posts', slug, post.frontmatter.cover)}
              alt=""
            />
          </div>
          <div className="aspect-[5/1] sm:h-[200px]" />
        </>
      ) : (
        <div className="h-24" />
      )}
      <div className="relative mx-auto max-w-2xl animate-fade-in px-4">
        <Prose>
          <Link href={`/posts/${post.slug}`} className="no-underline">
            <PostHeader slug={post.slug} />
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
                  <Link href={`/posts/${post.slug}`} className="no-underline">
                    <h1>{props.children}</h1>
                  </Link>
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
