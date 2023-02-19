import mime from 'mime-types'
import { Seo } from '@/components/Seo'
import { CommonHead } from '@/components/CommonHead'
import { Feeds } from '@/components/Feeds'
import { getPost } from '@/lib/blog'

type Props = {
  params: { slug: string }
}

export default async function Head({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) return null

  const image =
    post.meta.og_image ||
    `https://timomeh.de/assets/og-image/posts/${post.slug}.png`

  return (
    <>
      <CommonHead />
      <Feeds type="posts" />
      <Seo
        description={post.description}
        title={post.safeTitle}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          type: 'article',
          description: post.description,
          images: [
            {
              url: image,
              type: mime.lookup(image) || undefined,
            },
          ],
          article: {
            publishedTime: post.postedAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: ['Timo Mämecke'],
          },
          profile: {
            username: 'timomeh',
          },
          locale: post.meta.lang,
        }}
      />
    </>
  )
}
