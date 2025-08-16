'use client'

import { ImageProps } from 'next/image'
import { useState } from 'react'

import { OptimImage } from './optim-image'

export function FadeInImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(props.priority ? true : false)

  return (
    <OptimImage
      quality={90}
      data-loaded={loaded}
      aria-busy={!loaded}
      {...props}
      className={`opacity-0 transition-opacity duration-1000
        data-[loaded=true]:opacity-100 ${props.className || ''}`}
      onLoad={() => setLoaded(true)}
    />
  )
}
