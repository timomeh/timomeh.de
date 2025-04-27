import { memoize } from 'nextjs-better-unstable-cache'
import { getPlaiceholder } from 'plaiceholder'

import { config } from '../config'

// turn images into blurry placeholders

export async function getPlaceholder(src: string) {
  const placeholder = await getCachedPlaceholder(src)
  return placeholder
}

const getCachedPlaceholder = memoize(
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
  {
    revalidateTags: (src) => ['placeholder', `placeholder:${src}`],
  },
)
