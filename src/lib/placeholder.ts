import { getPlaiceholder } from 'plaiceholder'
import { unstable_cache } from 'next/cache'

// turn images into blurry placeholders

export async function getPlaceholder(src: string) {
  return getCachedPlaceholder(src)
}

// use old unstable_cache until the cache directive persists on disk
const getCachedPlaceholder = unstable_cache(
  async (src: string) => {
    const res = await fetch(src)
    const buffer = Buffer.from(await res.arrayBuffer())

    const {
      metadata: { height, width },
      ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 })

    return { css: plaiceholder.css, img: { src, height, width } }
  },
  ['placeholder'],
)
