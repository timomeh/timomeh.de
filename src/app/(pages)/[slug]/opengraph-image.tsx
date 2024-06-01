import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { getPageBySlug } from '@/app/_data/page.dto'
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
  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  return new ImageResponse(<OgBaseImage title={[page.title]} />, {
    ...size,
    ...(await getFonts()),
  })
}
