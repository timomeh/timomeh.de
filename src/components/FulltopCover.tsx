import probeImageSize from 'probe-image-size'
import Image from 'next/image'

type Props = {
  image: string
}

export async function FulltopCover({ image }: Props) {
  return (
    <>
      <div
        className="meh-fulltop z-[-1] relative mb-[-100px] lg:mb-[-120px] h-[240px] lg:h-[380px] select-none mix-blend-lighten overflow-hidden"
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
      <div className="meh-fulltop-cover h-[100px] lg:h-[120px] -mt-5">
        <div className="bg-[#151416]/60 backdrop-blur-xl rounded-t-lg w-auto h-full max-w-content mx-auto lg:mx-0" />
      </div>
    </>
  )
}
