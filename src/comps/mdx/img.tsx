import Image from 'next/image'
import { compileMDX } from 'next-mdx-remote/rsc'

import { getPlaceholder } from '@/lib/placeholder'

import { Anchor } from './anchor'
import { Code } from './code'
import { Del } from './del'
import { mdxOptions } from './mdx-options'

type Props = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

export async function Img(props: Props) {
  if (!props.src) return null

  const { img } = await getPlaceholder(props.src)
  let figcaption: JSX.Element | undefined

  if (props.title) {
    const result = await compileMDX({
      source: props.title,
      components: {
        p: ({ children }) => <>{children}</>,
        code: Code,
        a: Anchor,
        del: Del,
      },
      options: {
        mdxOptions,
      },
    })
    figcaption = result.content
  }

  const isFancy =
    !props.className?.includes('simple') && !props.className?.includes('plain')

  return (
    <figure className="md:-mx-4">
      <div className="relative">
        <Image
          src={img.src}
          quality={90}
          width={img.width}
          height={img.height}
          alt={props.alt || ''}
          className="mx-auto my-0 rounded-md"
        />
        {isFancy && (
          <Image
            src={img.src}
            quality={90}
            width={img.width}
            height={img.height}
            alt=""
            className="absolute inset-0 z-[-1] m-0 mx-auto select-none opacity-50 blur-lg filter"
            aria-hidden={true}
          />
        )}
      </div>
      {figcaption && (
        <figcaption className="mt-2 px-8 text-center prose-a:text-current">
          {figcaption}
        </figcaption>
      )}
    </figure>
  )
}
