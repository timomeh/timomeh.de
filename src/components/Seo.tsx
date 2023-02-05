import { merge } from 'lodash'
import { NextSeo, NextSeoProps } from 'next-seo'

const defaults: NextSeoProps = {
  titleTemplate: '%s | Timo Mämecke',
  openGraph: {
    type: 'website',
    locale: 'en_US',
  },
}

export function Seo(props: NextSeoProps) {
  const merged = merge(defaults, props)
  return <NextSeo useAppDir={true} {...merged} />
}
