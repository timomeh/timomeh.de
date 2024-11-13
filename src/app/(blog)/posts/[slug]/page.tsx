import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { getPost } from '@/data/posts'
import { contentAsset } from '@/data/cms'
import { Metadata } from 'next'

export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <article
      className="prose prose-invert relative animate-fade-in prose-headings:text-balance
        prose-headings:font-display prose-headings:font-semibold
        prose-headings:leading-tight max-sm:prose-h1:text-2xl
        max-sm:prose-h1:leading-tight"
      lang={post.meta.lang?.split('_')[0]}
    >
      <PostHeader slug={post.slug} />
      <MDX
        content={post.content}
        assetPrefix={contentAsset('posts', post.slug, '')}
      />
    </article>
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
