import { ImageResponse } from 'next/og'

import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'
import { TagOgImage } from '@/data/actions/tagOgImage'

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
  const { title } = await TagOgImage.invoke(params.tag)

  return new ImageResponse(<OpengraphBaseImage title={[title]} />, {
    ...size,
    ...(await getFonts()),
  })
}
