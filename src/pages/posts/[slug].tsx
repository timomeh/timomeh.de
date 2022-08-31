import type { GetStaticProps, GetStaticPaths } from 'next'
import { getPost, FullPost } from '../../lib/github'

type Props = {
  post: FullPost
}

export default function Post({ post }: Props) {
  return <div>{JSON.stringify(post)}</div>
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

  const post = await getPost(context.params.slug)

  if (!post) {
    return { notFound: true }
  }

  return {
    props: {
      post,
    },
  }
}
