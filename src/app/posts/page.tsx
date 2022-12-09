import Link from 'next/link'
import { getBlogPosts } from '../../lib/blog'
import { PostTitle } from '../../components/PostTitle'
import { Prose } from '../../components/Prose'

export default async function Posts() {
  const posts = await getBlogPosts()

  return (
    <>
      <Prose>
        <h1>Posts</h1>
        <p>
          Collection of things and thoughts I felt like writing about. A mixture
          of software development, JavaScript, React, or just random stuff.
        </p>
      </Prose>
      <div className="h-6" />
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`} className="font-semibold">
              <PostTitle
                title={post.title}
                className="decoration-fuchsia-400/40 decoration-2 hover:decoration-fuchsia-400/100 underline-offset-2 underline"
              />
            </Link>
            <span className="block leading-tight text-slate-500 text-sm">
              posted on {post.postedAt}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
