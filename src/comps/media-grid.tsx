/** biome-ignore-all lint/suspicious/noArrayIndexKey: it's fine */

import { contentAsset } from '../data/cms'
import { getPlaceholder } from '../lib/placeholder'
import { Lightbox } from './lightbox'
import { OptimImage } from './optim-image'

type Props = {
  images: {
    file: string
    alt?: string | null
  }[]
  shortId: string
}

export async function MediaGrid({ images, shortId }: Props) {
  if (images.length === 0) return null

  if (images.length === 1) {
    return (
      <Lightbox>
        <div className="flex justify-center">
          <MediaImage
            src={contentAsset('shorts', shortId, images[0].file)}
            alt={images[0].alt || ''}
            full
          />
        </div>
      </Lightbox>
    )
  }

  // tall left for 3
  if (images.length === 3) {
    return (
      <Lightbox>
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden [grid-auto-rows:15rem] md:[grid-auto-rows:18rem]">
          {images.map((image, i) => (
            <div key={i} className={i === 0 ? 'row-span-2 min-h-0' : 'min-h-0'}>
              <MediaImage
                src={contentAsset('shorts', shortId, image.file)}
                alt={image.alt || ''}
              />
            </div>
          ))}
        </div>
      </Lightbox>
    )
  }

  // simple grid
  return (
    <Lightbox>
      <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden [grid-auto-rows:15rem] md:[grid-auto-rows:18rem]">
        {images.map((image, i) => (
          <MediaImage
            key={i}
            src={contentAsset('shorts', shortId, image.file)}
            alt={image.alt || ''}
          />
        ))}
      </div>
    </Lightbox>
  )
}

async function MediaImage(props: {
  src: string
  alt?: string
  full?: boolean
}) {
  const { img, css } = await getPlaceholder(props.src)

  return (
    <div className="relative rounded-md overflow-hidden h-full w-full">
      <OptimImage
        src={img.src}
        quality={80}
        width={img.width}
        height={img.height}
        alt={props.alt || ''}
        data-fancybox="gallery"
        sizes={
          props.full
            ? '(max-width: 600px) 100vw, 500px'
            : '(max-width: 474px) 100vw, 300px'
        }
        className={
          props.full
            ? 'block max-h-80 md:max-h-[480px] w-auto rounded-md object-contain'
            : 'block h-full w-full object-cover'
        }
      />
      <div aria-hidden className="absolute inset-0 z-[-1]">
        <div
          className="mx-auto h-full max-w-full opacity-20 blur-md"
          style={{
            ...css,
            width: img.width,
          }}
        />
      </div>
    </div>
  )
}
