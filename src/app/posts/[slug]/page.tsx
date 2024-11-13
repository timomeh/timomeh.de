import { notFound } from 'next/navigation'

import { BackTag } from '@/comps/back-tag'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { getPost, getRelatedPosts } from '@/lib/blog'
import { HeaderSpacer } from '@/comps/header-spacer'
import { HeaderBackdropImage } from '@/comps/header-backdrop-image'
import { HeaderBackdropHaze } from '@/comps/header-backdrop-haze'
import { NextPost } from './next-post'
import { PrevPost } from './prev-post'
import { Footer } from '@/comps/footer'

export const dynamic = 'force-static'
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const [post, related] = await Promise.all([
    getPost(params.slug),
    getRelatedPosts(params.slug),
  ])
  if (!post) notFound()

  return (
    <>
      {related.next && <NextPost slug={related.next} />}

      <div className="flex min-h-dvh flex-col [grid-area:main]">
        <HeaderSpacer>
          {post.meta.cover_image ? (
            <HeaderBackdropImage src={post.meta.cover_image} />
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
              lang={post.meta.lang.split('_')[0]}
            >
              <PostHeader slug={post.slug} />
              <MDX content={post.body} />
            </article>
          </div>
        </main>
        <Footer />
      </div>

      {related.prev && <PrevPost slug={related.prev} />}
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return {
    title: post.safeTitle,
    description: post.description,
    openGraph: {
      type: 'article',
      description: post.description,
      publishedTime: new Date(post.postedAt).toISOString(),
      modifiedTime: new Date(post.postedAt).toISOString(),
      authors: ['Timo Mämecke'],
      locale: post.meta.lang,
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
