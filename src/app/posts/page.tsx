import Link from 'next/link'
import { listPosts, formatPostedAt } from '../../lib/blog'
import { PostTitle } from '../../components/PostTitle'
import { Prose } from '../../components/Prose'

export const revalidate = false

export default async function Posts() {
  const posts = await listPosts()

  return (
    <>
      <Prose>
        <h1>Posts</h1>
        <p>
          About software development and other thoughts I wanted to elaborate
          on.
        </p>
      </Prose>
      <div className="h-6" />
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="font-semibold">
              {/* @ts-expect-error Server Component */}
              <PostTitle
                title={post.title}
                className="decoration-fuchsia-400/40 decoration-2 hover:decoration-fuchsia-400/100 underline-offset-2 underline"
              />
            </Link>
            <span className="block leading-tight text-slate-500 text-sm">
              posted on {formatPostedAt(post.postedAt)}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
