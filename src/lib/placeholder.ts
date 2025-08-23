import { unstable_cache } from 'next/cache'
import { getPlaiceholder } from 'plaiceholder'
import probe from 'probe-image-size'

import imgproxyLoader from './imgproxyLoader'

// turn images into blurry placeholders

export async function getPlaceholder(src: string) {
  const placeholder = await getCachedPlaceholder(src)
  return placeholder
}

const getCachedPlaceholder = unstable_cache(
  async (src: string) => {
    const fullUrl = imgproxyLoader({ src, quality: 10, internal: true })
    const thumbUrl = imgproxyLoader({
      src,
      quality: 50,
      width: 120,
      internal: true,
    })

    const dimensions = await probe(fullUrl)

    const buffer = await fetch(thumbUrl).then(async (res) =>
      Buffer.from(await res.arrayBuffer()),
    )

    const { css } = await getPlaiceholder(buffer as Buffer<ArrayBuffer>, {
      size: 10,
    })

    return {
      css,
      img: { height: dimensions.height, width: dimensions.width, src },
    }
  },
  [],
  {
    tags: ['placeholder'],
  },
)
