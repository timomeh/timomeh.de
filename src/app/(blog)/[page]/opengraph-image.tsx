import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { getFonts, OpengraphBaseImage } from '@/comps/og-base-image'
import { getPageBySlug } from '@/data/pages'

export const generateStaticParams = () => []
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: Promise<{ page: string }>
}

export default async function Image(props: Props) {
  const params = await props.params
  const page = await getPageBySlug(params.page)
  if (!page) notFound()

  return new ImageResponse(<OpengraphBaseImage title={[page.title]} />, {
    ...size,
    ...(await getFonts()),
  })
}
