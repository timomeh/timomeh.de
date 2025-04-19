/* eslint-disable jsx-a11y/alt-text */
'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

export function FadeInImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(props.priority ? true : false)

  return (
    <Image
      quality={90}
      data-loaded={loaded}
      aria-busy={!loaded}
      {...props}
      className={`opacity-0 transition-opacity duration-1000 data-[loaded=true]:opacity-100
        ${props.className || ''}`}
      onLoad={() => setLoaded(true)}
    />
  )
}
