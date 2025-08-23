'use client'

import Image, { ImageProps } from 'next/image'

import imgproxyLoader from '../lib/imgproxyLoader'

export function OptimImage(props: ImageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image loader={imgproxyLoader} {...props} />
}
