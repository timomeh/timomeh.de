import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/app/_data/post.dto'
import { OgBaseImage, getFonts } from '@/app/_comps/og-base-image'

export const generateStaticParams = () => []
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: {
    slug: string
  }
}

export default async function Image({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return new ImageResponse(
    (
      <OgBaseImage
        title={[post.title]}
        cover={post.cover?.url || undefined}
        date={post.publishedAt || new Date()}
        est={post.readingTime}
      />
    ),
    {
      ...size,
      ...(await getFonts()),
    },
  )
}
