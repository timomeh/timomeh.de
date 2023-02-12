import probeImageSize from 'probe-image-size'
import Image from 'next/image'

type Props = {
  image: string
  title: string
  postedAt: Date
}

export async function FulltopCover({ image, title }: Props) {
  const size = await probeImageSize(image)

  return (
    <>
      <div
        className="meh-fulltop z-[-1] relative -mb-32 lg:-mb-36 select-none mix-blend-lighten"
        aria-hidden
      >
        <div className="relative opacity-75">
          <Image
            src={image}
            width={size.width}
            height={size.height}
            className="max-h-64 lg:max-h-96 w-full h-auto object-cover"
            alt=""
          />
        </div>
      </div>
      <div className="meh-fulltop-cover h-36 lg:h-40 -mt-4">
        <div className="bg-[#151416]/60 backdrop-blur-xl rounded-t-lg w-auto h-full max-w-content mx-auto lg:mx-0" />
      </div>
    </>
  )
}
