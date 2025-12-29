import Link from 'next/link'

import { Card } from '../../../comps/card'
import { Prose } from '../../../comps/prose'
import { TeaseYearPosts } from '../../../data/actions/teaseYearPosts'

type Props = {
  year?: number
}

export async function ReadMorePosts({ year }: Props) {
  const result = await TeaseYearPosts.invoke(year)
  if (!result) return null
  const { postYear, posts, fromYear } = result

  return (
    <section className="mt-10">
      <hr
        className="border-beige/50 mx-auto mb-10 max-w-xs border-1
          dark:border-white/10"
      />
      <div className="relative">
        <Card>
          <div className="p-4 sm:p-6 md:p-8">
            <Prose>
              <h2>
                <Link href={`/in/${fromYear}`} className="no-underline">
                  Continue to explore posts from {fromYear}
                </Link>
              </h2>
              <p>In the previous year, I wrote about:</p>
              <ul>
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>,{' '}
                    <small>
                      {new Date(post.publishedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </small>
                  </li>
                ))}
              </ul>
              <p>
                <Link
                  className="font-normal whitespace-nowrap no-underline
                  dark:text-blue-300"
                  href={`/in/${fromYear}`}
                >
                  and {postYear ? postYear.count - 4 : ''} more posts
                </Link>
              </p>
            </Prose>
          </div>
        </Card>
      </div>
    </section>
  )
}
