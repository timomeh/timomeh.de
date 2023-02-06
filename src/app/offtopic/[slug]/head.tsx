import mime from 'mime-types'
import { Seo } from '@/components/Seo'
import { getOfftopic } from '../../../lib/blog'
import { CommonHead } from '../../CommonHead'
import { Feeds } from '@/components/Feeds'

type Props = {
  params: { slug: string }
}

export default async function Head({ params }: Props) {
  const offtopic = await getOfftopic(params.slug)
  if (!offtopic) return null

  const image =
    offtopic.meta.og_image ||
    `https://timomeh.de/assets/og-image/offtopic/${offtopic.slug}.png`

  return (
    <>
      <CommonHead />
      <Feeds type="offtopic" />
      <Seo
        description={
          offtopic.meta.description ||
          `${offtopic.title}, posted on ${offtopic.postedAt.toLocaleDateString(
            'en-US',
            { dateStyle: 'medium' }
          )} by Timo Mämecke`
        }
        title={
          offtopic.meta.title ||
          offtopic.title ||
          offtopic.body.split(' ').slice(0, 10).join(' ').concat('…') ||
          offtopic.slug
        }
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
            publishedTime: offtopic.postedAt.toISOString(),
            modifiedTime: offtopic.updatedAt.toISOString(),
            authors: ['Timo Mämecke'],
          },
          profile: {
            username: 'timomeh',
          },
          locale: offtopic.meta.lang || 'en_US',
        }}
      />
    </>
  )
}
