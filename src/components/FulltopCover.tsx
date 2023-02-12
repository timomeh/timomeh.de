import probeImageSize from 'probe-image-size'
import Image from 'next/image'

type Props = {
  image: string
}

export async function FulltopCover({ image }: Props) {
  return (
    <>
      <div
        className="meh-fulltop z-[-1] relative h-[280px] lg:h-[380px] mb-[-120px] select-none mix-blend-lighten overflow-hidden"
        aria-hidden
      >
        <div className="relative opacity-75 h-full w-full">
          <Image
            src={image}
            className="absolute inset-0 object-cover"
            fill
            alt=""
          />
        </div>
      </div>
      <div className="meh-fulltop-cover">
        <div className="h-[160px] lg:absolute lg:mx-0 mx-auto w-full max-w-[650px]">
          <div className="bg-[#151416]/60 backdrop-blur-xl rounded-t-lg -mt-5 w-full h-full fade-bottom" />
        </div>
      </div>
    </>
  )
}
