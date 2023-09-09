import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

import { getPost } from '@/lib/blog'
import { Prose } from '@/components/Prose'
import { MDXRenderer } from '@/components/MDXRenderer'
import { TocMarker } from '@/components/Toc'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: {
    slug: string
  }
}

export default async function Post({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <article className="mx-4" lang={post.meta.lang.split('_')[0]}>
      <Prose>
        <TocMarker name="top">
          <header className="not-prose">
            <time className="text-xs uppercase opacity-50 font-bold flex">
              {post.postedAt.toLocaleString('en-US', {
                dateStyle: 'long',
              })}
            </time>
            <h1 className="text-2xl leading-snug font-bold mb-5 mt-1 font-display">
              <Balancer>
                <MDXRenderer content={post.title} inline />
              </Balancer>
            </h1>
          </header>
        </TocMarker>
        <MDXRenderer
          content={post.body}
          scope={post.number}
          hasToc={!!post.meta.toc}
          id={post.slug.concat('-single')}
        />
      </Prose>
    </article>
  )
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) return {}

  return {
    title: post.safeTitle,
    description: post.description,
    openGraph: {
      type: 'article',
      description: post.description,
      publishedTime: post.postedAt.toISOString(),
      modifiedTime: post.postedAt.toISOString(),
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
