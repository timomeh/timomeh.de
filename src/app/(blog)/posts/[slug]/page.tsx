import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ConditionalViewTransition } from '@/comps/conditional-view-transition'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'

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
      lang={post.meta.lang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <div className="p-4 sm:p-6 md:p-8">
        <ConditionalViewTransition name={`${post.slug}-post`}>
          <Prose>
            <PostHeader
              publishedAt={post.publishedAt}
              readingTime={formatReadingTime(
                post.content,
                post.frontmatter.readingTime,
                'read',
              )}
            />
            <MDX
              cacheKey={`post-${post.slug}`}
              cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
              content={post.content}
              assetPrefix={contentAsset('posts', post.slug, '')}
            />
          </Prose>
        </ConditionalViewTransition>
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  return []
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
