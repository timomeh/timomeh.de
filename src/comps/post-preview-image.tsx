import { ImageProps } from 'next/image'

import { getPlaceholder } from '@/lib/placeholder'

import { FadeInImage } from './fade-in-image'

type Props = ImageProps & { src: string }

export async function PostPreviewImage({ alt, src, ...rest }: Props) {
  const { css, img } = await getPlaceholder(src)

  return (
    <>
      <div
        className="relative aspect-5/2 max-h-[350px] min-h-[200px] w-full
          [mask-image:linear-gradient(to_bottom,#000_0%,transparent_100%)]"
      >
        <div className="absolute inset-0 overflow-hidden mix-blend-lighten dark:mix-blend-multiply">
          <div
            className="absolute inset-0 z-[-1] h-full w-full scale-150 transform blur-2xl filter"
            style={css}
          />
          <FadeInImage alt={alt} src={img.src} {...rest} />
        </div>
        <div
          className="absolute inset-0 z-[-1] h-full w-full opacity-50 mix-blend-lighten blur-lg
            filter dark:mix-blend-multiply"
          style={css}
        />
      </div>
    </>
  )
}
