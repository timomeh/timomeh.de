import mime from 'mime-types'
import { Seo } from '@/components/Seo'
import { getPost } from '../../../lib/blog'
import { CommonHead } from '../../CommonHead'
import { Feeds } from '@/components/Feeds'

type Props = {
  params: { slug: string }
}

export default async function Head({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) return null

  const image =
    post.meta.og_image ||
    `https://timomeh.de/assets/og-image/offtopic/${post.slug}.png`

  return (
    <>
      <CommonHead />
      <Feeds type="offtopic" />
      <Seo
        description={
          post.meta.description ||
          `${post.title}, posted on ${post.postedAt.toLocaleDateString(
            'en-US',
            { dateStyle: 'medium' }
          )} by Timo Mämecke`
        }
        title={post.title}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          type: 'article',
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
          locale: post.meta.lang || 'en_US',
        }}
      />
    </>
  )
}
