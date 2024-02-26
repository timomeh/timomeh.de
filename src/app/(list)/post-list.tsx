import Link from 'next/link'

import { MDX } from '@/comps/mdx/mdx'
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
            return (
              <article
                key={post.number}
                className="group/post mb-6 sm:mb-4 sm:flex"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <div className="font-pixel text-2xs leading-none sm:text-xs">
                      <time className="text-purple-300">
                        {post.postedAt.toLocaleString('en-US', {
                          month: 'short',
                          day: '2-digit',
                        })}
                      </time>
                      <span className="text-white/50">
                        {' | '}
                        {post.estMinutes} min
                      </span>
                    </div>
                    {post.tags.map((tag) => (
                      <Tag
                        key={tag.slug}
                        color={tag.color}
                        name={tag.name}
                        size="smol"
                      />
                    ))}
                  </div>
                  <h3 className="mt-1 text-balance font-display font-semibold leading-snug">
                    <Link href={`/posts/${post.slug}`}>
                      <MDX content={post.title} inline />
                    </Link>
                  </h3>
                </div>
              </article>
            )
          })}
        </div>
      ))}
    </>
  )
}
