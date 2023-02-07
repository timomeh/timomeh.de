import { notFound } from 'next/navigation'

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
    <>
      <main className="meh-main">
        <article className="mx-4">
          <Prose size={hasTitle ? 'yes' : 'big'}>
            <header className="not-prose">
              <time className="text-xs uppercase opacity-50 font-bold flex -mb-1">
                {offtopic.postedAt.toLocaleString('en-US', {
                  dateStyle: 'long',
                })}
              </time>
              {hasTitle && (
                <h1 className="text-2xl leading-snug underline underline-offset-4 decoration-violet-400 font-bold mb-5 font-display">
                  <MDXRenderer content={offtopic.title!} inline />
                </h1>
              )}
            </header>
            <MDXRenderer content={offtopic.body} scope={offtopic.number} />
          </Prose>
        </article>
      </main>
    </>
  )
}
