import { ImageResponse } from 'next/og'

import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'
import { getTag } from '@/data/tags'
import { notFound } from 'next/navigation'

export const generateStaticParams = () => []
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ tag: string }>
}

export default async function Image(props: Props) {
  const params = await props.params
  const tag = await getTag(params.tag)
  if (!tag) notFound()

  return new ImageResponse(
    <OpengraphBaseImage title={[`Posts about ${tag.title}`]} />,
    {
      ...size,
      ...(await getFonts()),
    },
  )
}
