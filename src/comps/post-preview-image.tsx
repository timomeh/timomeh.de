import { ImageProps } from 'next/image'

import { getPlaceholder } from '@/lib/placeholder'

import { FadeInImage } from './fade-in-image'

type Props = ImageProps & { src: string }

export async function PostPreviewImage({ alt, src, ...rest }: Props) {
  const { css, img } = await getPlaceholder(src)

  return (
    <div
      className="relative aspect-[3/1] max-h-[300px] w-full
        [mask-image:linear-gradient(to_bottom,#000_0%,#000_30%,transparent_100%)]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 z-[-1] h-full w-full scale-150 transform blur-2xl filter"
          style={css}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-black/50" />
        <FadeInImage alt={alt} src={img.src} {...rest} />
      </div>
      <div
        className="absolute inset-0 z-[-1] h-full w-full opacity-50 blur-lg filter"
        style={css}
      />
    </div>
  )
}
