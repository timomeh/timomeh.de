import Image from 'next/image'

import comic from './comic.png'
import comicO from './comic-o-overlay.png'

export function Mug() {
  return (
    <div className="relative">
      <Image priority src={comic} alt="" className="size-full object-contain" />
      <Image
        priority
        src={comicO}
        alt=""
        aria-hidden={true}
        className="absolute left-0 top-0 size-full object-contain opacity-0 transition-all
          duration-75 group-active/link:opacity-100"
      />
    </div>
  )
}
