import { PostPreviewImage } from './post-preview-image'

type Props = {
  src: string
}

export function HeaderBackdropImage({ src }: Props) {
  return (
    <div className="absolute inset-0 h-[280px] animate-fade-in lg:h-[380px]">
      <PostPreviewImage src={src} alt="" priority large />
    </div>
  )
}
