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
    <div>
      <Prose big={!hasTitle}>
        <div className="not-prose">
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
            <h2 className="mt-0 text-2xl transition-all underline underline-offset-4 decoration-violet-400 font-bold mb-5 font-display">
              <Link href={`/offtopic/${offtopic.slug}`} className="glow">
                {offtopic.title}
              </Link>
            </h2>
          )}
        </div>
        <MDXRenderer content={offtopic.body} shiftHeadings />
      </Prose>
    </div>
  )
}