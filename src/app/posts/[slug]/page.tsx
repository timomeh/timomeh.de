import { notFound } from 'next/navigation'

import { BackTag } from '@/comps/back-tag'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { getPost } from '@/lib/blog'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
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
