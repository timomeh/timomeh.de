import { memoize } from 'nextjs-better-unstable-cache'
import { getPlaiceholder } from 'plaiceholder'

import imgproxyLoader from './imgproxyLoader'

// turn images into blurry placeholders

export async function getPlaceholder(src: string) {
  const placeholder = await getCachedPlaceholder(src)
  return placeholder
}

const getCachedPlaceholder = memoize(
  async (src: string) => {
    const url = imgproxyLoader({ src })

    const res = await fetch(url)
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
