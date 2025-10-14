import Link from 'next/link'

import { Card } from '../../../comps/card'
import { RandomDeco } from '../../../comps/deco'
import { Prose } from '../../../comps/prose'
import { listPostYears, listPublishedPostsByYear } from '../../../data/posts'

type Props = {
  year?: number
}

export async function ReadMorePosts({ year }: Props) {
  const fromYear = year || (await getLatestYear()) - 1

  const posts = await listPublishedPostsByYear(fromYear, { limit: 4 })

  if (posts.length < 1) {
    return null
  }

  const postYears = await listPostYears()
  const postYear = postYears.find((py) => py.year === fromYear)

  return (
    <section className="mt-10">
      <hr
        className="border-beige/50 mx-auto mb-10 max-w-xs border-1
          dark:border-white/10"
      />
      <div className="relative">
        <RandomDeco seed={`more-${year}`} />
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

async function getLatestYear() {
  const postYears = await listPostYears()
  const postYear = postYears[0]
  return postYear.year
}
