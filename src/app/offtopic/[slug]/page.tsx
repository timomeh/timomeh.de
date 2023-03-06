import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

import { getOfftopic } from '@/lib/blog'
import { Prose } from '@/components/Prose'
import { MDXRenderer } from '@/components/MDXRenderer'

export const revalidate = false

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
    <>
      <main className="meh-main">
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
      </main>
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const offtopic = await getOfftopic(params.slug)
  if (!offtopic) return {}

  const image =
    offtopic.meta.og_image ||
    `https://timomeh.de/assets/og-image/offtopic/${offtopic.slug}.png`

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
      images: [
        {
          url: image,
          height: 630,
          width: 1200,
        },
      ],
    },
    alternates: {
      types: {
        'application/atom+xml': 'https://timomeh.de/offtopic/feed.atom',
        'application/rss+xml': 'https://timomeh.de/offtopic/feed.rss',
        'application/feed+json': 'https://timomeh.de/offtopic/feed.json',
      },
    },
  }
}
