import Link from 'next/link'

import { MDX } from '@/comps/mdx/mdx'
import { PostTag } from '@/comps/post-tag'
import { getPublishedPostsRange, listPublishedPosts } from '@/data/posts'
import { formatReadingTime } from '@/lib/formatReadingTime'
import { markdownHeadline } from '@/lib/markdownHeadline'
import { range } from '@/lib/range'

type Props = {
  tag?: string
}

export async function PostList({ tag }: Props) {
  const [latest, earliest] = await getPublishedPostsRange({ tag })
  const years = range(earliest.getFullYear(), latest.getFullYear()).reverse()

  return (
    <>
      {years.map((year) => (
        <div key={year} className="mt-10 text-gray-800 dark:text-white">
          <h2
            className="dark:effect-crt-blue dark:font-pixel text-2xl leading-none font-black
              text-orange-800/35 dark:font-bold"
          >
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
      <div className="font-display font-semibold dark:text-white/50">
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
                className="font-display dark:font-pixel text-sm leading-none font-medium dark:text-xs
                  dark:font-normal"
              >
                <time className="text-purple-600 dark:text-purple-300">
                  {new Date(post.publishedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: '2-digit',
                  })}
                </time>
                <span className="text-gray-500 dark:text-white/50">
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
            <h3 className="font-display mt-1 leading-snug font-medium text-balance">
              <Link href={`/posts/${post.slug}`}>
                <MDX
                  cacheKey={`archive-list-title-${post.slug}`}
                  cacheTags={[
                    'mdx-type:archive-post-list',
                    `mdx-post:${post.slug}`,
                  ]}
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
