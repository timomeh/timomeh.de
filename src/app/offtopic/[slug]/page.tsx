import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

import { getOfftopic } from '@/lib/blog'
import { Prose } from '@/components/Prose'
import { MDXRenderer } from '@/components/MDXRenderer'

export const revalidate = false
export const generateStaticParams = () => []

type Props = {
  params: {
    slug: string
  }
}

export default async function Offtopic({ params }: Props) {
  const offtopic = await getOfftopic(params.slug)
  if (!offtopic) notFound()

  const hasTitle = !!offtopic.title

  return (
    <article className="mx-4" lang={offtopic.meta.lang.split('_')[0]}>
      <Prose size={hasTitle ? 'yes' : 'big'}>
        <header className="not-prose">
          <time className="text-xs uppercase opacity-50 font-bold flex">
            {offtopic.postedAt.toLocaleString('en-US', {
              dateStyle: 'long',
            })}
          </time>
          {hasTitle && (
            <h1 className="text-2xl leading-snug font-bold mb-5 mt-1 font-display">
              <Balancer>
                <MDXRenderer content={offtopic.title!} inline />
              </Balancer>
            </h1>
          )}
        </header>
        <MDXRenderer
          content={offtopic.body}
          scope={offtopic.number}
          id={offtopic.slug.concat('-single')}
        />
      </Prose>
    </article>
  )
}

export async function generateMetadata({ params }: Props) {
  const offtopic = await getOfftopic(params.slug)
  if (!offtopic) return {}

  return {
    title: offtopic.safeTitle,
    description: offtopic.description,
    openGraph: {
      type: 'article',
      description: offtopic.description,
      publishedTime: offtopic.postedAt.toISOString(),
      modifiedTime: offtopic.postedAt.toISOString(),
      authors: ['Timo Mämecke'],
      locale: offtopic.meta.lang,
    },
    alternates: {
      types: {
        'application/atom+xml': '/offtopic/feed.atom',
        'application/rss+xml': '/offtopic/feed.rss',
        'application/feed+json': '/offtopic/feed.json',
      },
    },
  }
}
