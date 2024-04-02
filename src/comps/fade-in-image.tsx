/* eslint-disable jsx-a11y/alt-text */
'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

export function FadeInImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Image
      quality={90}
      fill
      data-fade-in
      data-loaded={loaded}
      aria-busy={!loaded}
      className="absolute inset-0 object-cover opacity-0 transition-opacity duration-1000
        data-[loaded=true]:opacity-100"
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
