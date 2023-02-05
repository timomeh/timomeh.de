import { InViewMarker } from '@/components/InViewMarker'
import { MDXRenderer } from '@/components/MDXRenderer'
import { Prose } from '@/components/Prose'
import { Offtopic } from '@/lib/blog'
import Link from 'next/link'

type Props = {
  offtopic: Offtopic
}

export function ListedOfftopic({ offtopic }: Props) {
  const hasTitle = !!offtopic.title

  return (
    <article className="mx-4">
      <Prose size={hasTitle ? 'yes' : 'big'}>
        <InViewMarker name={offtopic.slug}>
          <div className="not-prose" id={offtopic.slug}>
            <time className="text-xs uppercase font-bold flex -mb-1">
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
              <h2 className="mt-0 text-2xl leading-snug transition-all underline underline-offset-4 decoration-violet-400 font-bold mb-5 font-display">
                <Link href={`/offtopic/${offtopic.slug}`} className="glow">
                  {offtopic.title}
                </Link>
              </h2>
            )}
          </div>
        </InViewMarker>
        <MDXRenderer
          content={offtopic.body}
          shiftHeadings
          scope={offtopic.number}
        />
      </Prose>
    </article>
  )
}
