import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ConditionalViewTransition } from '@/comps/conditional-view-transition'
import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { Tag } from '@/comps/tag'
import { contentAsset } from '@/data/cms'
import { getPostBySlug } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'

type Props = {
  params: Promise<{ slug: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article
      lang={post.metaLang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <ConditionalViewTransition name={`${post.slug}-post`}>
        <Prose>
          <PostHeader
            publishedAt={post.publishedAt}
            readingTime={formatReadingTime(
              post.content,
              post.readingTime,
              'read',
            )}
          />
          <div className="not-prose -m-0.5 mb-2 hidden sm:block lg:hidden">
            {post.postTags.map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="group/btn inline-flex p-0.5"
              >
                <Tag title={tag.title} />
              </Link>
            ))}
          </div>
          <MDX
            cacheKey={`post-${post.slug}`}
            cacheTags={['mdx-type:post', `mdx-post:${post.slug}`]}
            content={post.content}
            assetPrefix={contentAsset('posts', post.slug, '')}
          />
        </Prose>
      </ConditionalViewTransition>
    </article>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const metadata: Metadata = {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      type: 'article',
      description: post.metaDescription || undefined,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: ['Timo Mämecke'],
      locale: post.metaLang || undefined,
    },
    alternates: {
      types: {
        'application/atom+xml': '/posts/feed.atom',
        'application/rss+xml': '/posts/feed.rss',
        'application/feed+json': '/posts/feed.json',
      },
    },
  }

  if (post.metaImage) {
    metadata.openGraph!.images = [
      { url: contentAsset('posts', post.slug, post.metaImage) },
    ]
  }

  return metadata
}
