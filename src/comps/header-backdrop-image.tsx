import { PostPreviewImage } from './post-preview-image'

type Props = {
  src: string
}

export function HeaderBackdropImage({ src }: Props) {
  return (
    <div className="animate-fade-in absolute inset-0 h-[280px] lg:h-[380px]">
      <PostPreviewImage src={src} alt="" priority />
    </div>
  )
}
