import Link from 'next/link'
import React from 'react'

import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'

import { Lightbox } from '../../../../comps/lightbox'
import { PostMetadata, ShowPost } from './data'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { post, assetPrefix, est } = await ShowPost.invoke(params.slug)

  return (
    <article
      lang={post.metaLang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <div className="p-4 sm:p-6 md:p-8 md:py-12 max-w-2xl mx-auto">
        <Prose>
          <span className="not-prose inline-flex">
            <PostHeader publishedAt={post.publishedAt} />
          </span>
          <Lightbox>
            <MDX
              cacheKey={`post-${post.slug}`}
              cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
              content={post.content}
              assetPrefix={assetPrefix}
              scope="post"
              components={{
                h1: (props) => {
                  return (
                    <>
                      <h1>{props.children}</h1>
                      <aside
                        className="
                          -mt-4 text-sm
                          dark:text-white/40
                          border-b
                          dark:border-white/15
                          text-black/60 border-black/15
                        "
                      >
                        <p className="mb-3">
                          {est}. Tagged{' '}
                          {post.postTags.map(({ tag }, i) => (
                            <React.Fragment key={tag.slug}>
                              <Link
                                href={`/tag/${tag.slug}`}
                                className="
                                  text-current
                                  dark:hover:text-white/80
                                  hover:text-black/90
                                  no-underline transition-colors
                                "
                              >
                                {tag.title}
                              </Link>
                              {i < post.postTags.length - 1 && <span>, </span>}
                            </React.Fragment>
                          ))}
                        </p>
                      </aside>
                    </>
                  )
                },
              }}
            />
          </Lightbox>
        </Prose>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  return PostMetadata.invoke(params.slug)
}
