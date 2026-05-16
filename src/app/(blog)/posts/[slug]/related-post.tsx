import Link from 'next/link'

import { PostEyebrow } from '@/app/(blog)/post-eyebrow'
import { ListRelatedPosts } from '@/app/(blog)/posts/[slug]/data'
import { Prose } from '@/comps/prose'

export async function RelatedPosts({ forSlug }: { forSlug: string }) {
  const posts = await ListRelatedPosts.invoke(forSlug)
  if (!posts) return null

  return (
    <section>
      <div className="mx-auto max-w-2xl p-4 !pb-12 sm:p-6 md:p-8">
        <h2 className="mb-6 font-serif text-2xl font-semibold">
          More like this
        </h2>

        <ul className="space-y-5">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="mb-1">
                <PostEyebrow post={post} linked />
              </div>
              <Prose>
                <h3>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="no-underline hover:underline"
                    prefetch={false}
                  >
                    {post.title}
                  </Link>
                </h3>
              </Prose>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
