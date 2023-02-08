import { notFound } from 'next/navigation'

import { getPost } from '@/lib/blog'
import { getChapters } from '@/lib/mdx'
import { slugify } from '@/lib/slugify'
import { Prose } from '@/components/Prose'
import { MDXRenderer } from '@/components/MDXRenderer'
import { Toc, TocEntry, TocMarker } from '@/components/Toc'

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

  const chapters = getChapters(post.body)

  return (
    <>
      <main className="meh-main">
        <article className="mx-4">
          <Prose>
            <TocMarker name="top">
              <header className="not-prose">
                <time className="text-xs uppercase opacity-50 font-bold flex -mb-1">
                  {post.postedAt.toLocaleString('en-US', {
                    dateStyle: 'long',
                  })}
                </time>
                <h1 className="text-2xl leading-snug underline underline-offset-4 decoration-violet-400 font-bold mb-5 font-display">
                  <MDXRenderer content={post.title} inline />
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
