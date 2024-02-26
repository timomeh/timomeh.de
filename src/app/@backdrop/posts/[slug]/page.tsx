import Image from 'next/image'
import { notFound } from 'next/navigation'

import { getPost } from '@/lib/blog'
import { getPlaceholder } from '@/lib/placeholder'

import DefaultPage from '../../page'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  if (!post.meta.cover_image) {
    return <DefaultPage />
  }

  const { css, img } = await getPlaceholder(post.meta.cover_image)

  return (
    <div
      className="absolute inset-0 h-[280px] overflow-clip border-0 border-b border-white/10
        opacity-75 lg:h-[380px]"
    >
      <div
        className="absolute inset-0 z-[-1] h-full w-full scale-150 transform blur-2xl filter"
        style={css}
      />
      <Image
        src={img.src}
        fill
        className="absolute inset-0 object-cover"
        loading="eager"
        alt=""
      />
    </div>
  )
}
