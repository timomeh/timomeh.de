import mime from 'mime-types'
import { getOfftopic } from '@/lib/blog'
import { Seo } from '@/components/Seo'
import { CommonHead } from '@/components/CommonHead'
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
        description={offtopic.description}
        title={offtopic.safeTitle}
        twitter={{
          cardType: 'summary_large_image',
        }}
        openGraph={{
          type: 'article',
          description: offtopic.description,
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
          locale: offtopic.meta.lang,
        }}
      />
    </>
  )
}
