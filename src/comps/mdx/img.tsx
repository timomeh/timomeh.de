import Image from 'next/image'

import { getPlaceholder } from '@/lib/placeholder'

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

export async function Img(props: Props) {
  if (!props.src) return null

  const { img, css } = await getPlaceholder(props.src)
  const filename = new URL(props.src).pathname.split('/').pop()
  const theme = filename?.startsWith('darkmode-')
    ? 'dark'
    : filename?.startsWith('lightmode-')
      ? 'light'
      : 'none'

  return (
    <div
      className="relative data-[image-theme=dark]:hidden dark:data-[image-theme=dark]:block
        dark:data-[image-theme=light]:hidden md:[&:not(figure_&)]:-mx-4"
      data-image-theme={theme}
    >
      <Image
        src={props.src}
        quality={90}
        width={img.width}
        height={img.height}
        alt={props.alt || ''}
        className="relative mx-auto rounded-md"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[-1] group-data-[shadow=false]/figure:hidden"
      >
        <div
          className="mx-auto h-full max-w-full opacity-20 blur-md"
          style={{
            ...css,
            width: img.width,
          }}
        />
      </div>
    </div>
  )
}
