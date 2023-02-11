import { merge } from 'lodash'
import { NextSeo, NextSeoProps } from 'next-seo'

const defaults: NextSeoProps = {
  titleTemplate: '%s | Timo Mämecke',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    defaultImageWidth: 1200,
    defaultImageHeight: 630,
    images: [
      {
        url: 'https://timomeh.de/assets/og-image/static/default.png',
        type: 'image/png',
        height: 630,
        width: 1200,
      },
    ],
  },
}

export function Seo(props: NextSeoProps) {
  const merged = merge({}, defaults, props)
  if (merged.openGraph?.images?.[0]) {
    merged.openGraph.images[0].secureUrl = merged.openGraph.images[0].url
  }

  return (
    <NextSeo
      useAppDir={true}
      defaultTitle="Timo – Web Development and feeling ways about stuff."
      {...merged}
    />
  )
}
