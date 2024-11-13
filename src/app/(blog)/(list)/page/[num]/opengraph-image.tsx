import { ImageResponse } from 'next/og'

import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'
import { notFound } from 'next/navigation'
import { saneParseInt } from '@/lib/saneParseInt'

export const generateStaticParams = () => []
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ num: string }>
}

export default async function Image(props: Props) {
  const params = await props.params
  const num = saneParseInt(params.num)
  if (!num) notFound()

  return new ImageResponse(
    <OpengraphBaseImage title={[`All Posts, Page ${num}`]} />,
    {
      ...size,
      ...(await getFonts()),
    },
  )
}
