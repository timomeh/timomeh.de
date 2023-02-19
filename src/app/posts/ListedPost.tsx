import { MDXRenderer } from '@/components/MDXRenderer'
import { Prose } from '@/components/Prose'
import { TocMarker } from '@/components/Toc'
import { Post } from '@/lib/blog'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'

type Props = {
  post: Post
}

export function ListedPost({ post }: Props) {
  return (
    <article className="mx-4" lang={post.meta.lang.split('_')[0]}>
      <Prose>
        <TocMarker name={post.slug}>
          <div className="not-prose">
            <time className="text-xs uppercase font-bold flex">
              <Link
                className="opacity-50 hover:opacity-80 transition-opacity"
                href={`/posts/${post.slug}`}
              >
                {post.postedAt.toLocaleString('en-US', {
                  dateStyle: 'long',
                })}
              </Link>
            </time>
            <h2 className="mt-1 text-2xl leading-snug transition-all font-bold mb-5 font-display">
              <Balancer>
                <Link href={`/posts/${post.slug}`} className="glow">
                  <MDXRenderer content={post.title} inline />
                </Link>
              </Balancer>
            </h2>
          </div>
        </TocMarker>
        {post.excerpt && (
          <MDXRenderer
            content={post.excerpt}
            shiftHeadings
            scope={post.number}
            id={post.slug.concat('-listed')}
          />
        )}
      </Prose>
    </article>
  )
}
