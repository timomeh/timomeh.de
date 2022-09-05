import React from 'react'
import type { GetStaticProps } from 'next'
import { Layout } from '../../components/Layout'
import Link from 'next/link'
import { getBlogPosts, ShortPost } from '../../lib/blog'
import { PostTitle } from '../../components/PostTitle'
import { Prose } from '../../components/Prose'
import Head from 'next/head'

type Props = {
  posts: ShortPost[]
}

export default function Posts({ posts }: Props) {
  return (
    <Layout
      footerLinks={
        <a
          href="https://github.com/timomeh/timomeh.de/discussions"
          rel="noopener noreferrer"
          target="_blank"
        >
          Posts on GitHub
        </a>
      }
    >
      <Head>
        <title>Posts | Timo Mämecke</title>
        <meta
          name="description"
          content="Collection of things and thoughts I felt like writing about. A mixture of software development, JavaScript, React, or just random stuff."
        />
      </Head>
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
            <Link href={`/posts/${post.slug}`}>
              <a className="font-semibold">
                <PostTitle
                  title={post.title}
                  className="hover:underline decoration-pink-600/80 decoration-2"
                />
              </a>
            </Link>
            <span className="block leading-tight text-slate-500 text-sm">
              posted on {post.postedAt}
            </span>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getBlogPosts()

  return {
    props: {
      posts,
    },
  }
}
