import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { Layout } from '../../components/Layout'
import { PostTitle } from '../../components/PostTitle'
import { Prose } from '../../components/Prose'
import { FullPost, getBlogPost } from '../../lib/blog'

type Props = {
  post: FullPost
}

export default function Post({ post }: Props) {
  return (
    <Layout
      githubUrl={`https://github.com/timomeh/timomeh.de/discussions/${post.discussionNumber}`}
    >
      <Head>
        <title>{`${post.rawTitle} | Timo Mämecke`}</title>
        <meta
          property="og:image"
          content={`https://timomeh.de/assets/og-image/posts/${post.slug}.png`}
          key="og-image"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${post.rawTitle} | Timo Mämecke`}
        />
        <meta
          name="twitter:image"
          content={`https://timomeh.de/assets/og-image/posts/${post.slug}.png`}
        />
      </Head>
      <Prose>
        <h1 className="!mb-0">
          <PostTitle title={post.title} />
        </h1>
        <span className="text-slate-500 text-sm">
          posted on {post.postedAt}
        </span>
        <div className="h-6 md:h-8" />
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
