import { notFound } from 'next/navigation'

import { BackTag } from '@/comps/back-tag'
import { MDX } from '@/comps/mdx/mdx'
import { Tag } from '@/comps/tag'
import { getPost } from '@/lib/blog'

import { Transition } from './transition'

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

      <Transition>
        <article
          className="prose prose-invert relative"
          lang={post.meta.lang.split('_')[0]}
        >
          <div className="mb-1 flex flex-wrap items-center gap-1">
            <div className="font-pixel text-xs leading-none antialiased [font-feature-settings:'ss01']">
              <time className="text-purple-300">
                {post.postedAt.toLocaleString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </time>
              <span className="text-white/50">
                {' | '}
                {post.estMinutes} min reading time
              </span>
            </div>
            {post.tags.map((tag) => (
              <Tag
                key={tag.slug}
                color={tag.color}
                name={tag.name}
                size="smol"
              />
            ))}
          </div>
          <h1 className="mb-8 text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
            <MDX content={post.title} inline />
          </h1>
          <MDX content={post.body} />
        </article>
      </Transition>
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
