import { unstable_cache } from 'next/cache'
import { getPlaiceholder } from 'plaiceholder'

import { config } from '../config'

// turn images into blurry placeholders

export async function getPlaceholder(src: string) {
  return getCachedPlaceholder(src)
}

// use old unstable_cache until the cache directive persists on disk
const getCachedPlaceholder = unstable_cache(
  async (src: string) => {
    const res = await fetch(
      src.startsWith('http') ? src : new URL(src, config.siteUrl).href,
    )
    const buffer = Buffer.from(await res.arrayBuffer())

    const {
      metadata: { height, width },
      ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 })

    return { css: plaiceholder.css, img: { src, height, width } }
  },
  ['placeholder'],
)
