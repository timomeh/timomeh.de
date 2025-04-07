import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { Card } from '@/comps/card'
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
                  className="block size-12 p-2 text-orange-950 opacity-40 transition hover:-translate-x-0.5
                    hover:opacity-70 dark:text-white"
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
                  className="block size-12 p-2 text-orange-950 opacity-40 transition hover:translate-x-0.5
                    hover:opacity-70 dark:text-white"
                >
                  <ArrowRightCircle />
                </Link>
              </ViewTransition>
            </div>
          </div>
        )}
        <ConditionalViewTransition name={`${post.slug}-post`}>
          <Card>
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
          </Card>
        </ConditionalViewTransition>
        <section className="mt-10 mb-6 flex max-w-full flex-col flex-wrap gap-4 sm:flex-row sm:gap-6">
          <h4 className="sr-only">Pagination</h4>
          {newerPost && (
            <Link
              href={`/posts/${newerPost.slug}`}
              className="w-2/3 min-w-[250px] flex-1 self-start sm:w-0 sm:self-stretch"
            >
              <Card>
                <div className="p-4">
                  <div
                    className="font-display dark:font-pixel text-sm leading-none font-medium dark:text-xs
                      dark:font-normal"
                  >
                    <span className="text-gray-500 dark:text-white/70">
                      Next post{' | '}
                    </span>
                    <time className="text-purple-600 dark:text-purple-300">
                      {new Date(newerPost.publishedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="font-display mt-2 text-lg leading-none font-medium">
                    {newerPost.title}
                  </h3>
                </div>
              </Card>
            </Link>
          )}
          {!newerPost && <div className="w-0 flex-1" />}
          {olderPost && (
            <Link
              href={`/posts/${olderPost.slug}`}
              className="w-2/3 min-w-[250px] flex-1 self-end sm:w-0 sm:self-stretch"
            >
              <Card>
                <div className="p-4 text-right">
                  <div
                    className="font-display dark:font-pixel text-sm leading-none font-medium dark:text-xs
                      dark:font-normal"
                  >
                    <time className="text-purple-600 dark:text-purple-300">
                      {new Date(olderPost.publishedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </time>
                    <span className="text-gray-500 dark:text-white/70">
                      {' | '}Previous post
                    </span>
                  </div>
                  <h3 className="font-display mt-2 text-lg leading-none font-medium">
                    {olderPost.title}
                  </h3>
                </div>
              </Card>
            </Link>
          )}
          {!olderPost && <div className="w-0 flex-1" />}
        </section>
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
