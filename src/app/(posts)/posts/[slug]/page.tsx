import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'
import { Tag } from '@/comps/tag'
import { getPost } from '@/lib/blog'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {post.meta.cover_image && (
        <div
          className="bg-grainy absolute inset-x-0 top-[37px] h-[83px] border-t border-white/10
            sm:top-[63px] sm:h-[41px] sm:rounded-t-xl sm:border-x lg:h-[141px]"
        />
      )}

      <div className="mb-10 flex sm:pt-6">
        <Link href="/">
          <Tag color="#DEC1EF" clickable name="← Back" />
        </Link>
      </div>

      <article
        className="prose prose-invert relative"
        lang={post.meta.lang.split('_')[0]}
      >
        <div className="mb-1 flex flex-wrap items-center gap-1">
          <div className="font-pixel text-xs leading-none">
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
            <Tag key={tag.slug} color={tag.color} name={tag.name} size="smol" />
          ))}
        </div>
        <h1 className="text-balance font-display text-2xl leading-tight">
          <MDX content={post.title} inline />
        </h1>
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
