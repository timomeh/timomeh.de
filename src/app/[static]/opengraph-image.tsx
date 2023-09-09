import { ImageResponse } from 'next/server'
import { getFonts, OpengraphBaseImage } from '../OpengraphBaseImage'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

type Props = {
  params: {
    static: string
  }
}

const titles = {
  about: ['Hi,', 'I’m Timo 👋'],
  impressum: ['Impressum'],
  datenschutz: ['Datenschutz'],
  feeds: ['Feeds'],
} as Record<string, string[]>

export default async function Image({ params }: Props) {
  return new ImageResponse(
    <OpengraphBaseImage title={titles[params.static]} />,
    {
      ...size,
      ...(await getFonts()),
    }
  )
}
