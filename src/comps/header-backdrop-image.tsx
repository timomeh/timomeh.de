import { PostImage } from './post-image'
import { SocialBox } from './social-box'

type Props = {
  src: string
}

export function HeaderBackdropImage({ src }: Props) {
  return (
    <div className="absolute inset-0 h-[280px] animate-fade-in overflow-clip lg:h-[380px]">
      <div className="absolute inset-x-0 top-0 z-10 h-0">
        <div className="relative mx-auto max-w-2xl px-4">
          <SocialBox floating />
        </div>
      </div>
      <PostImage src={src} alt="" priority />
      <div className="absolute bottom-0 z-0 hidden w-full border-0 border-b border-white/20 sm:block" />
      <div className="relative top-[176px] z-10 mx-auto h-[83px] max-w-2xl px-4">
        <div
          className="absolute inset-x-0 bottom-0 top-[21px] h-[83px] border-t border-white/10
            bg-grainy sm:top-[63px] sm:h-[41px] sm:rounded-t-xl sm:border-x lg:h-[141px]"
        />
      </div>
    </div>
  )
}
