import { getPlaceholder } from '@/lib/placeholder'

import { FadeInImage } from './fade-in-image'

type Props = {
  src: string
}

export async function PostImage({ src }: Props) {
  const { css, img } = await getPlaceholder(src)

  return (
    <>
      <div
        className="absolute inset-0 z-[-1] h-full w-full scale-150 transform blur-2xl filter"
        style={css}
      />
      <FadeInImage src={img.src} alt="" priority />
    </>
  )
}
