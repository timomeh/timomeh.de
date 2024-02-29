'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

export function FadeInImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      src={props.src}
      fill
      className={`absolute inset-0 object-cover transition-opacity duration-1000 ${
        loaded ? '' : 'opacity-0'
      }`}
      onLoadingComplete={() => setLoaded(true)}
      alt=""
    />
  )
}
