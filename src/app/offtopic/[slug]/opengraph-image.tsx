import { getOfftopic } from '@/lib/blog'
import { ImageResponse } from 'next/og'
import { getFonts, OpengraphBaseImage } from '../../OpengraphBaseImage'

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
  const offtopic = await getOfftopic(params.slug)
  if (!offtopic) return null

  return new ImageResponse(
    (
      <OpengraphBaseImage
        title={[offtopic.safeTitle]}
        cover={offtopic.meta.cover_image}
        date={offtopic.postedAt}
      />
    ),
    {
      ...size,
      ...(await getFonts()),
    }
  )
}
