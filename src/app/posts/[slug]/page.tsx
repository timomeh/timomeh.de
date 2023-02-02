import { notFound } from 'next/navigation'

import { Prose } from '@/components/Prose'
import { getPost } from '@/lib/blog'

import { MDXRenderer } from '@/components/MDXRenderer'

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
    <>
      <main className="meh-main">
        <article>
          <Prose>
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
            <MDXRenderer content={post.body} scope={post.number} />
          </Prose>
        </article>
      </main>
    </>
  )
}
