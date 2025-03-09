import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <article
      className="animate-fade-in relative"
      lang={post.meta.lang?.split('_')[0]}
    >
      <Prose>
        <ViewTransition name={`${post.slug}-post-header`}>
          <PostHeader slug={post.slug} />
        </ViewTransition>
        <ViewTransition name={`${post.slug}-post-content`}>
          <MDX
            cacheKey={`post-${post.slug}`}
            cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
            content={post.content}
            assetPrefix={contentAsset('posts', post.slug, '')}
          />
        </ViewTransition>
      </Prose>
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
