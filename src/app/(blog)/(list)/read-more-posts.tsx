import Link from 'next/link'

import { Card } from '../../../comps/card'
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

  return (
    <section className="mt-10">
      <hr className="border-beige/70 mx-auto mb-10 max-w-xs border-1 dark:border-white/10" />
      <Card>
        <div className="p-4 sm:p-6 md:p-8">
          <Prose>
            <h2>
              <Link href={`/in/${fromYear}`} className="no-underline">
                Continue to explore posts from {fromYear}
              </Link>
            </h2>
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
              <li>
                <Link href={`/in/${fromYear}`}>…and more</Link>
              </li>
            </ul>
          </Prose>
        </div>
      </Card>
    </section>
  )
}

async function getLatestYear() {
  const postYears = await listPostYears()
  const postYear = postYears[0]
  return postYear.year
}
