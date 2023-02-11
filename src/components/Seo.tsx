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
      },
    ],
  },
}

export function Seo(props: NextSeoProps) {
  const merged = merge(defaults, props)
  return (
    <NextSeo
      useAppDir={true}
      defaultTitle="Timo – Web Development and feeling ways about stuff."
      {...merged}
    />
  )
}
