import Link from 'next/link'

import { MDXRenderer } from '@/components/MDXRenderer'
import { Offtopic } from '@/lib/blog'

type Props = {
  offtopic: Offtopic
}

export function ListedOfftopic({ offtopic }: Props) {
  return (
    <article className="mx-4" lang={offtopic.meta.lang.split('_')[0]}>
      <div className="not-prose" id={offtopic.slug}>
        <time className="text-xs uppercase font-bold">
          <Link
            className="opacity-50 hover:opacity-80 transition-opacity w-full"
            href={`/offtopic/${offtopic.slug}`}
          >
            {offtopic.postedAt.toLocaleString('en-US', {
              dateStyle: 'medium',
            })}
          </Link>
        </time>
        <h2 className="text-lg leading-snug transition-all font-bold mb-5 font-display">
          <Link href={`/offtopic/${offtopic.slug}`} className="glow">
            <MDXRenderer
              content={offtopic.title!}
              inline
              id={offtopic.slug.concat('-listed')}
            />
          </Link>
        </h2>
      </div>
      {/* <MDXRenderer
          content={
            offtopic.excerpt
              ? offtopic.excerpt.concat(
                  ` <span className="not-prose"><a href="/offtopic/${offtopic.slug}" className="opacity-70 hover:opacity-100 transition-opacity glow">Continue…</a></span>`
                )
              : offtopic.body
          }
          shiftHeadings
          scope={offtopic.number}
        /> */}
    </article>
  )
}
