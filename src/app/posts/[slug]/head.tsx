import { getPost } from '../../../lib/blog'
import { CommonHead } from '../../CommonHead'

type Props = {
  params: {
    slug: string
  }
}

export default async function Head({ params }: Props) {
  const post = await getPost(params.slug)

  if (!post) {
    return null
  }

  return (
    <>
      <CommonHead />
      <title>{`${post.title} | Timo Mämecke`}</title>
      <meta
        property="og:image"
        content={`https://timomeh.de/assets/og-image/posts/${post.slug}.png`}
        key="og-image"
      />
      <meta
        name="description"
        content={`${post.title}, posted on ${post.postedAt} by Timo Mämecke`}
        key="description"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content={`${post.title} | Timo Mämecke`}
        key="twitter-title"
      />
      <meta
        name="twitter:image"
        content={`https://timomeh.de/assets/og-image/posts/${post.slug}.png`}
        key="twitter-image"
      />
    </>
  )
}
