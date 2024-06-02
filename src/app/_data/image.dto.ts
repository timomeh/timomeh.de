import { memoize } from 'nextjs-better-unstable-cache'
import { ImageRepo } from './image.repository'

export const imageCacheKey = {
  singlePlaceholder: {
    cache: (imgSrc: string) => ['imgPlaceholder', `imgPlaceholder:${imgSrc}`],
    invalidate: (imgSrc: string) => `imgPlaceholder:${imgSrc}`,
    invalidateAll: () => 'imgPlaceholder',
  },
}

export const getImagePlaceholder = memoize(
  async (imgSrc: string) => {
    const result = await ImageRepo.generatePlaceholder(imgSrc)
    return {
      css: result.css,
      img: {
        src: imgSrc,
        height: result.metadata.height,
        width: result.metadata.width,
      },
    }
  },
  {
    revalidateTags: (imgSrc) => imageCacheKey.singlePlaceholder.cache(imgSrc),
  },
)
