import { ImageResponse } from 'next/og'

import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'
import { PostOgImage } from './data'

export const generateStaticParams = () => []
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const { title, cover, date, est } = await PostOgImage.invoke(slug)

  return new ImageResponse(
    <OpengraphBaseImage title={[title]} cover={cover} date={date} est={est} />,
    {
      ...size,
      ...(await getFonts()),
    },
  )
}
