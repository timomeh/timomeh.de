import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'
import { PostHeader } from '@/comps/post-header'
import { Prose } from '@/comps/prose'
import { Tag } from '@/comps/tag'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { getTag } from '@/data/tags'
import { formatReadingTime } from '@/lib/formatReadingTime'

type Props = {
  params: Promise<{ slug: string }>
}

export const fetchCache = 'force-cache'

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  const nullableTags = await Promise.all(post.tags.map((slug) => getTag(slug)))
  const tags = nullableTags.filter((tag) => tag !== null)

  return (
    <article
      lang={post.meta.lang?.split('_')[0]}
      className="relative"
      data-landmark="content-page"
    >
      <Prose>
        <PostHeader
          publishedAt={post.publishedAt}
          readingTime={formatReadingTime(
            post.content,
            post.frontmatter.readingTime,
            'read',
          )}
        />
        <div className="not-prose -m-0.5 mb-2 hidden sm:block lg:hidden">
          {tags.map((tag) => (
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
