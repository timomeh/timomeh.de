import Image from 'next/image'

import comic from './comic.png'

export function Mug() {
  return (
    <Image
      loading="eager"
      src={comic}
      alt=""
      className="size-full object-contain"
    />
  )
}
