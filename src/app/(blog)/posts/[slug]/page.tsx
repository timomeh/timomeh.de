import { notFound } from 'next/navigation'

import { BackTag } from '@/app/_comps/back-tag'
import { PostHeader } from '@/app/_comps/post-header'
import { MDX } from '@/app/_comps/mdx/mdx'
import { getPostBySlug, listPosts } from '@/app/_data/post.dto'
import { HeaderSpacer } from '@/app/_comps/header-spacer'
import { Footer } from '@/app/_comps/footer'
import { HeaderBackdropHaze } from '@/app/_comps/header-backdrop-haze'
import { HeaderBackdropImage } from '@/app/_comps/header-backdrop-image'
import { Suspense } from 'react'
import { NextPost } from './next-post'
import { PrevPost } from './prev-post'

export const dynamic = 'force-static'
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const [post, list] = await Promise.all([
    getPostBySlug(params.slug),
    listPosts(params.slug),
  ])
  if (!post) notFound()

  const index = list.findIndex((slug) => post.slug === slug) // could be -1 for unlisted
  const nextPost = index !== -1 ? list[index - 1] : undefined
  const prevPost = index !== -1 ? list[index + 1] : undefined

  return (
    <>
      {nextPost && (
        <Suspense fallback={<div />}>
          <NextPost slug={nextPost} />
        </Suspense>
      )}

      <div className="flex min-h-dvh flex-col">
        <HeaderSpacer>
          {post.cover?.url ? (
            <HeaderBackdropImage src={post.cover.url} />
          ) : (
            <HeaderBackdropHaze />
          )}
        </HeaderSpacer>
        <main className="relative z-30 w-full flex-1">
          <div className="relative mx-auto max-w-2xl px-4">
            <div className="mb-10 flex sm:pt-6">
              <BackTag />
            </div>

            <article
              className="prose prose-invert relative animate-fade-in"
              lang={post.lang || 'en'}
            >
              <PostHeader slug={post.slug} />
              <MDX content={post.body} />
            </article>
          </div>
        </main>
        <Footer />
      </div>

      {prevPost && (
        <Suspense fallback={<div />}>
          <PrevPost slug={prevPost} />
        </Suspense>
      )}
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return {
    title: post.meta.title || post.title,
    description: post.meta.description || post.excerpt,
    openGraph: {
      type: 'article',
      description: post.meta.description || post.excerpt,
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: ['Timo Mämecke'],
      locale: post.lang || 'en',
      images: post.meta.ogImage ? [post.meta.ogImage] : undefined,
    },
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }
}
