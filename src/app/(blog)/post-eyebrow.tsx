import Link from 'next/link'

import { ListedPost } from '@/app/(blog)/data'
import { TagLink } from '@/comps/tag-link'
import { formatReadingTime } from '@/lib/formatReadingTime'

export function PostEyebrow({
  post,
  linked,
  prefetch,
}: {
  post: Omit<ListedPost, 'type'>
  linked?: boolean
  prefetch?: boolean
}) {
  const $published = (
    <time dateTime={post.publishedAt.toISOString()}>
      {new Date(post.publishedAt).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })}
    </time>
  )

  return (
    <div className="font-mono text-sm font-medium text-current/60 md:text-xs">
      <div>
        {post.postTags.map(({ tag }, i) => (
          <span key={tag.slug}>
            <TagLink {...tag} prefetch={prefetch} />
            {i <= post.postTags.length - 2 && ', '}
          </span>
        ))}
      </div>
      <div>
        {linked ? (
          <Link
            href={`/posts/${post.slug}`}
            className="hover:underline"
            prefetch={prefetch}
          >
            {$published}
          </Link>
        ) : (
          <>{$published}</>
        )}
        ,{' '}
        <span>{formatReadingTime(post.content, post.readingTime, 'read')}</span>
      </div>
    </div>
  )
}
