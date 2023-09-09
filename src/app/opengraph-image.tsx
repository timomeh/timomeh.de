import { ImageResponse } from 'next/server'
import { getFonts, OpengraphBaseImage } from './OpengraphBaseImage'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <OpengraphBaseImage
        title={[
          'Timo Mämecke,',
          'Web App Development,',
          'and feeling ways about stuff.',
        ]}
      />
    ),
    {
      ...size,
      ...(await getFonts()),
    }
  )
}
