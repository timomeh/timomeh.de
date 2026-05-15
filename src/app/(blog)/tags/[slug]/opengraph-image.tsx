import { ImageResponse } from 'next/og'

import { TagOgImage } from '@/app/(blog)/tags/data'
import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'

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
  const { title } = await TagOgImage.invoke(slug)

  return new ImageResponse(<OpengraphBaseImage title={[title]} />, {
    ...size,
    ...(await getFonts()),
  })
}
