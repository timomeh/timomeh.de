import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { ConditionalViewTransition } from '@/comps/ConditionalViewTransition'
import { ArrowLeftCircle } from '@/comps/icons/arrow-left-circle'
import { ArrowRightCircle } from '@/comps/icons/arrow-right-circle'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getNewerPost, getOlderPost, getPost } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  const newerPost = await getNewerPost(post.slug)
  const olderPost = await getOlderPost(post.slug)

  return (
    <div className="flex flex-col items-center sm:mx-4">
      <article
        lang={post.meta.lang?.split('_')[0]}
        className="relative w-full max-w-[720px]"
      >
        {!!newerPost && (
          <div className="absolute top-0 right-full bottom-[180px] hidden w-12 min-[840px]:block">
            <div className="sticky top-1/2">
              <ViewTransition name="next-post-arrow">
                <Link
                  title="Next post"
                  href={`/posts/${newerPost.slug}`}
                  className="block size-12 text-gray-900 opacity-20 transition hover:-translate-x-0.5
                    hover:opacity-50 dark:text-white"
                >
                  <ArrowLeftCircle />
                </Link>
              </ViewTransition>
            </div>
          </div>
        )}
        {!!olderPost && (
          <div className="absolute top-0 bottom-[180px] left-full hidden w-12 min-[840px]:block">
            <div className="sticky top-1/2">
              <ViewTransition name="prev-post-arrow">
                <Link
                  title="Previous post"
                  href={`/posts/${olderPost.slug}`}
                  className="block size-12 text-gray-900 opacity-20 transition hover:translate-x-0.5
                    hover:opacity-50 dark:text-white"
                >
                  <ArrowRightCircle />
                </Link>
              </ViewTransition>
            </div>
          </div>
        )}
        <ConditionalViewTransition name={`${post.slug}-post`}>
          <div className="wrapper px-4 py-6 sm:px-6 sm:py-10">
            <Prose>
              <PostHeader slug={post.slug} />
              <MDX
                cacheKey={`post-${post.slug}`}
                cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
                content={post.content}
                assetPrefix={contentAsset('posts', post.slug, '')}
              />
            </Prose>
          </div>
        </ConditionalViewTransition>
      </article>
    </div>
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  const metadata: Metadata = {
    title: post.title,
    description: post.meta.description,
    openGraph: {
      type: 'article',
      description: post.meta.description || undefined,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: ['Timo Mämecke'],
      locale: post.meta.lang || undefined,
    },
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }

  if (post.meta.image) {
    metadata.openGraph!.images = [
      { url: contentAsset('posts', post.slug, post.meta.image) },
    ]
  }

  return metadata
}
