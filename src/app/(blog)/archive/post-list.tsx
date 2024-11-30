import { unstable_cacheTag as cacheTag } from 'next/cache'
import Link from 'next/link'
import { PostTag } from '@/comps/post-tag'
import { MDX } from '@/comps/mdx/mdx'
import { getPublishedPostsRange, listPublishedPosts } from '@/data/posts'
import { range } from '@/lib/range'
import { formatReadingTime } from '@/lib/formatReadingTime'
import { markdownHeadline } from '@/lib/markdownHeadline'

type Props = {
  tag?: string
}

export async function PostList({ tag }: Props) {
  'use cache'
  cacheTag('posts-list')

  const [latest, earliest] = await getPublishedPostsRange({ tag })
  const years = range(earliest.getFullYear(), latest.getFullYear()).reverse()

  return (
    <>
      {years.map((year) => (
        <div key={year} className="mt-10">
          <h2 className="effect-crt-blue font-pixel text-2xl font-bold leading-none">
            {year}
          </h2>
          <div className="h-4" />
          <PostsByYear tag={tag} year={year} />
        </div>
      ))}
    </>
  )
}

async function PostsByYear({ tag, year }: { tag?: string; year?: number }) {
  const posts = await listPublishedPosts({ tag, year })

  if (posts.length === 0) {
    return (
      <div className="font-display font-semibold text-white/50">
        No posts this year {':('}
      </div>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <article className="group/post mb-6 sm:mb-4 sm:flex" key={post.slug}>
          <div>
            <div className="flex items-center gap-1">
              <div
                className="font-pixel text-2xs leading-none antialiased [font-feature-settings:'ss01']
                  sm:text-xs"
              >
                <time className="text-purple-300">
                  {new Date(post.publishedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                  })}
                </time>
                <span className="text-white/50">
                  {' | '}
                  {formatReadingTime(
                    post.content,
                    post.frontmatter.readingTime,
                  )}
                </span>
              </div>
              {post.tags.map((tag) => (
                <PostTag key={tag} slug={tag} size="smol" />
              ))}
            </div>
            <h3 className="mt-1 text-balance font-display font-medium leading-snug">
              <Link href={`/posts/${post.slug}`}>
                <MDX
                  content={markdownHeadline(post.content) || post.title}
                  inline
                  components={{
                    a: (props) => <>{props.children}</>,
                  }}
                />
              </Link>
            </h3>
          </div>
        </article>
      ))}
    </>
  )
}
