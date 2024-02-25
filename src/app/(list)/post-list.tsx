import Link from 'next/link'

import { Tag } from '@/comps/tag'
import { groupPostsByYear, listPosts } from '@/lib/blog'

type Props = {
  tag?: string
}

export default async function PostList({ tag }: Props) {
  const posts = await listPosts({ tag })
  const postsByYear = groupPostsByYear(posts)

  return (
    <>
      {postsByYear.map(({ year, posts }) => (
        <div key={year} className="mt-10">
          <h2 className="effect-crt-blue font-pixel text-2xl font-bold leading-none">
            {year}
          </h2>
          <div className="h-4" />
          {posts.length === 0 && (
            <div className="font-display font-semibold text-white/50">
              No posts this year
            </div>
          )}
          {posts.map((post) => {
            const [firstTag, ...moreTags] = post.tags

            return (
              <article
                key={post.number}
                className="group/post mb-6 sm:mb-3 sm:flex"
              >
                <time
                  className="w-12 flex-shrink-0 pt-1.5 text-right font-pixel text-xs tabular-nums
                    text-purple-300"
                >
                  {post.postedAt.toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                  })}
                </time>
                <div className="w-2 flex-shrink-0" />
                <h3 className="text-balance font-display text-lg font-semibold leading-snug">
                  <Link href={`/post/${post.slug}`}>{post.safeTitle}</Link>
                </h3>
                <div className="h-2 min-w-2 flex-1" />
                <div className="-ml-1 flex flex-wrap gap-1 self-start sm:ml-0 sm:justify-end">
                  <div className="flex gap-1 self-start sm:justify-end">
                    <Tag color="black" name={`${post.estMinutes}min`} />
                    {firstTag && (
                      <Tag color={firstTag.color} name={firstTag.name} />
                    )}
                  </div>
                  {moreTags.map((tag) => (
                    <Tag key={tag.slug} color={tag.color} name={tag.name} />
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      ))}
    </>
  )
}
