import Link from 'next/link'

import { PostEyebrow } from '@/app/(blog)/post-eyebrow'
import { Prose } from '@/comps/prose'

import { SearchPosts } from './data'

type Props = {
  query: string
}

export async function SearchResults({ query }: Props) {
  const posts = await SearchPosts.invoke(query)

  return (
    <>
      <ul className="space-y-5">
        {posts.map((post) => (
          <li key={post.id}>
            <div className="mb-1">
              <PostEyebrow post={post} linked />
            </div>
            <Prose>
              <h4>
                <Link
                  href={`/posts/${post.slug}`}
                  className="no-underline hover:underline"
                  data-search-result
                >
                  {post.title}
                </Link>
              </h4>
            </Prose>
          </li>
        ))}
      </ul>
      {posts.length > 0 && <div className="h-4" />}
    </>
  )
}
