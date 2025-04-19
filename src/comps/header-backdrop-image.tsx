import { getPlaceholder } from '@/lib/placeholder'

import { FadeInImage } from './fade-in-image'

type Props = {
  lightSrc?: string
  darkSrc?: string
}

export async function HeaderBackdropImage({ lightSrc, darkSrc }: Props) {
  const [lightCover, darkCover] = await Promise.all([
    lightSrc ? getPlaceholder(lightSrc) : Promise.resolve(null),
    darkSrc ? getPlaceholder(darkSrc) : Promise.resolve(null),
  ])

  return (
    <div className="relative -mb-36 h-auto w-full opacity-90 mix-blend-darken dark:mix-blend-lighten">
      {lightCover && (
        <div
          data-has-dark={!!darkCover}
          className="relative mx-auto block h-auto max-h-[500px] min-h-[300px] w-full max-w-[1024px]
            overflow-hidden
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            [mask-composite:intersect]
            lg:[mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%),linear-gradient(to_left,#000_95%,transparent_100%),linear-gradient(to_right,#000_95%,transparent_100%)]
            dark:data-[has-dark=true]:hidden"
          style={{ aspectRatio: lightCover.img.width / lightCover.img.height }}
        >
          <FadeInImage
            alt=""
            fill
            src={lightCover.img.src}
            className="h-auto w-full max-w-full object-cover object-bottom"
          />
          <div
            className="absolute inset-0 -z-10 h-full w-full transform blur-2xl filter"
            style={lightCover.css}
          />
        </div>
      )}
      {darkCover && (
        <div
          className="relative mx-auto hidden h-auto max-h-[500px] min-h-[300px] w-full max-w-[1024px]
            overflow-hidden
            [mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%)]
            [mask-composite:intersect]
            lg:[mask-image:linear-gradient(to_bottom,#000_95%,transparent_100%),linear-gradient(to_left,#000_95%,transparent_100%),linear-gradient(to_right,#000_95%,transparent_100%)]
            dark:block"
          style={{ aspectRatio: darkCover.img.width / darkCover.img.height }}
        >
          <FadeInImage
            alt=""
            fill
            src={darkCover.img.src}
            className="h-auto w-full max-w-full object-cover object-bottom"
          />
          <div
            className="absolute inset-0 -z-10 h-full w-full transform blur-2xl filter"
            style={darkCover.css}
          />
        </div>
      )}
    </div>
  )
}
