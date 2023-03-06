import { notFound } from 'next/navigation'
import Balancer from 'react-wrap-balancer'

import { getPost } from '@/lib/blog'
import { getChapters } from '@/lib/mdx'
import { slugify } from '@/lib/slugify'
import { Prose } from '@/components/Prose'
import { MDXRenderer } from '@/components/MDXRenderer'
import { Toc, TocEntry, TocMarker } from '@/components/Toc'
import { FulltopCover } from '@/components/FulltopCover'

export const revalidate = false

type Props = {
  params: {
    slug: string
  }
}

export default async function Post({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const chapters = getChapters(post.body)

  return (
    <>
      {post.meta.cover_image && (
        // @ts-expect-error Server Component
        <FulltopCover image={post.meta.cover_image} />
      )}
      <main className="meh-main">
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
      </main>
      {post.meta.toc && (
        <aside className="meh-aside">
          <Toc>
            <TocEntry name="top">
              <MDXRenderer content={post.title} inline />
            </TocEntry>
            {chapters.map((chapter) => {
              const slug = slugify(chapter)

              return (
                <TocEntry name={slug} key={slug}>
                  <MDXRenderer content={chapter} inline />
                </TocEntry>
              )
            })}
          </Toc>
        </aside>
      )}
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) return {}

  const image =
    post.meta.og_image ||
    `https://timomeh.de/assets/og-image/posts/${post.slug}.png`

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
        'application/atom+xml': 'https://timomeh.de/posts/feed.atom',
        'application/rss+xml': 'https://timomeh.de/posts/feed.rss',
        'application/feed+json': 'https://timomeh.de/posts/feed.json',
      },
    },
  }
}
