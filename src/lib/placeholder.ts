import { unstable_cache } from 'next/cache'
import { getPlaiceholder } from 'plaiceholder'

export const getPlaceholder = unstable_cache(
  async (src: string) => {
    const buffer = await fetch(src).then(async (res) =>
      Buffer.from(await res.arrayBuffer()),
    )

    const {
      metadata: { height, width },
      ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 })

    return { css: plaiceholder.css, img: { src, height, width } }
  },
  ['plaiceholder'],
)
