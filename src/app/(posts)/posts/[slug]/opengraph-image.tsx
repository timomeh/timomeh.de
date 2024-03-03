import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { getPost } from '@/lib/blog'

import { getFonts, OpengraphBaseImage } from '../../../OpengraphBaseImage'

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
  const post = await getPost(params.slug)
  if (!post) notFound()

  return new ImageResponse(
    (
      <OpengraphBaseImage
        title={[post.safeTitle]}
        cover={post.meta.cover_image}
        date={post.postedAt}
        est={post.estMinutes}
      />
    ),
    {
      ...size,
      ...(await getFonts()),
    },
  )
}
