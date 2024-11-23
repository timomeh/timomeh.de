import { getPlaiceholder } from 'plaiceholder'
import { unstable_cacheLife as cacheLife } from 'next/cache'

// turn images into blurry placeholders

export async function getPlaceholder(src: string) {
  'use cache'
  cacheLife('max')

  const res = await fetch(src)
  const buffer = Buffer.from(await res.arrayBuffer())

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 })

  return { css: plaiceholder.css, img: { src, height, width } }
}
