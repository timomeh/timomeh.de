import Image from 'next/image'

import comic from './comic.png'

export function Mug() {
  return (
    <Image priority src={comic} alt="" className="size-full object-contain" />
  )
}
