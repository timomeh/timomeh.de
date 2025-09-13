'use client'

import Image, { type ImageProps } from 'next/image'

import imgproxyLoader from '../lib/imgproxyLoader'

export function OptimImage(props: ImageProps) {
  return <Image loader={imgproxyLoader} {...props} />
}
