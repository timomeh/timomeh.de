import { ImageProps } from 'next/image'

import { getPlaceholder } from '@/lib/placeholder'

import { FadeInImage } from './fade-in-image'

type Props = ImageProps & { src: string }

export async function PostPreviewImage({ alt, src, ...rest }: Props) {
  const { css, img } = await getPlaceholder(src)

  return (
    <div
      className="relative aspect-5/2 max-h-[350px] min-h-[200px] w-full
        [mask-image:linear-gradient(to_bottom,#000_0%,transparent_100%)]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 z-[-1] h-full w-full scale-150 transform blur-2xl filter"
          style={css}
        />
        <FadeInImage alt={alt} src={img.src} {...rest} />
        <div
          className="absolute inset-0 z-10 bg-gray-400 bg-linear-to-t mix-blend-hard-light
            dark:bg-transparent dark:from-black/80 dark:to-black/50 dark:mix-blend-normal"
        />
      </div>
      <div
        className="absolute inset-0 z-[-1] h-full w-full opacity-50 blur-lg filter"
        style={css}
      />
    </div>
  )
}
