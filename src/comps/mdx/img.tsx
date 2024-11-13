import Image from 'next/image'

import { getPlaceholder } from '@/lib/placeholder'

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

export async function Img(props: Props) {
  if (!props.src) return null

  const { img, css } = await getPlaceholder(props.src)

  return (
    <div className="relative md:[&:not(figure_&)]:-mx-4">
      <Image
        src={props.src}
        quality={90}
        width={img.width}
        height={img.height}
        alt={props.alt || ''}
        className="relative rounded-md"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[-1] opacity-50 blur-lg"
        style={css}
      />
    </div>
  )
}
