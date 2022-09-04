import type { GetStaticProps, GetStaticPaths } from 'next'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { Layout } from '../../components/Layout'
import { PostTitle } from '../../components/PostTitle'
import { Prose } from '../../components/Prose'
import { FullPost, getBlogPost } from '../../lib/blog'
import Link from 'next/link'

type Props = {
  post: FullPost
}

export default function Post({ post }: Props) {
  return (
    <Layout>
      <Prose>
        <h1 className="!mb-0">
          <PostTitle title={post.title} />
        </h1>
        <span className="text-slate-500 text-sm">
          posted on {post.postedAt}
        </span>
        <div className="h-6 lg:h-8" />
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </Prose>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

type Param = { slug: string }

export const getStaticProps: GetStaticProps<Props, Param> = async (context) => {
  if (!context.params) {
    throw new Error('context.params is undefined')
  }

  const post = await getBlogPost(context.params.slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      post,
    },
  }
}
