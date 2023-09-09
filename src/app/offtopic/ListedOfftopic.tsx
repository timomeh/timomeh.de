import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

import { MDXRenderer } from '@/components/MDXRenderer'
import { Prose } from '@/components/Prose'
import { TocMarker } from '@/components/Toc'
import { Offtopic } from '@/lib/blog'

type Props = {
  offtopic: Offtopic
}

export function ListedOfftopic({ offtopic }: Props) {
  const hasTitle = !!offtopic.title

  return (
    <article className="mx-4" lang={offtopic.meta.lang.split('_')[0]}>
      <Prose size={hasTitle ? 'yes' : 'big'}>
        <TocMarker name={offtopic.slug}>
          <div className="not-prose" id={offtopic.slug}>
            <time className="text-xs uppercase font-bold flex">
              <Link
                className="opacity-50 hover:opacity-80 transition-opacity"
                href={`/offtopic/${offtopic.slug}`}
              >
                {offtopic.postedAt.toLocaleString('en-US', {
                  dateStyle: 'long',
                })}
              </Link>
            </time>
            {hasTitle && (
              <h2 className="text-2xl leading-snug mt-1 transition-all font-bold mb-5 font-display">
                <Balancer>
                  <Link href={`/offtopic/${offtopic.slug}`} className="glow">
                    <MDXRenderer
                      content={offtopic.title!}
                      inline
                      id={offtopic.slug.concat('-listed')}
                    />
                  </Link>
                </Balancer>
              </h2>
            )}
          </div>
        </TocMarker>
        <MDXRenderer
          content={
            offtopic.excerpt
              ? offtopic.excerpt.concat(
                  ` <span className="not-prose"><a href="/offtopic/${offtopic.slug}" className="opacity-70 hover:opacity-100 transition-opacity glow">Continue…</a></span>`
                )
              : offtopic.body
          }
          shiftHeadings
          scope={offtopic.number}
        />
      </Prose>
    </article>
  )
}
