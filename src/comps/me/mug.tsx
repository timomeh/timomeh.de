import Image from 'next/image'

import comic from './comic.png'
import comicO from './comic-o-overlay.png'

export function Mug() {
  return (
    <div className="relative size-full">
      <Image priority src={comic} alt="" className="size-full object-contain" />
      <Image
        priority
        src={comicO}
        alt=""
        aria-hidden={true}
        className="absolute top-0 left-0 size-full object-contain opacity-0 transition-all
          duration-75 select-none group-active/link:opacity-100
          in-data-[force-shocked-mug=true]:opacity-100"
        draggable={false}
      />
    </div>
  )
}
