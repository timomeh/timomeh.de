import React from 'react'
import type { GetStaticProps } from 'next'
import { groupBy } from 'lodash'
import { Layout } from '../../components/Layout'
import { getPostsList, PostPreview } from '../../lib/github'
import Link from 'next/link'

type Props = {
  postArchive: [string, PostPreview[]][]
}

export default function Posts({ postArchive }: Props) {
  return (
    <Layout>
      <h1 className="font-display font-medium text-3xl">Post Archive</h1>
      {postArchive.map(([year, posts]) => (
        <React.Fragment key={year}>
          <h2 className="font-display mb-1 text-2xl text-purple-400 font-semibold">
            {year}
          </h2>
          <ul className="list-none p-0 space-y-1.5 mb-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`}>
                  <a className="flex space-x-3">
                    <div className="tabular-nums flex-shrink-0 flex text-night-500 font-light">
                      {post.postedAt}
                    </div>
                    <div className="text-night-100 font-bold">{post.title}</div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPostsList()

  const groupedPosts = groupBy(posts, (post) =>
    new Date(post.createdAt).getFullYear()
  )
  const postArchive = Object.keys(groupedPosts)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => [year, groupedPosts[year]] as const)

  return {
    props: {
      postArchive,
    },
  }
}
