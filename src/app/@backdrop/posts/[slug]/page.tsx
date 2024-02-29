import { notFound } from 'next/navigation'

import { getPost } from '@/lib/blog'
import { getPlaceholder } from '@/lib/placeholder'

import DefaultPage from '../../page'
import { FadeInImage } from './fade-in-image'
import { Transition } from './transition'

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
    <Transition>
      <div
        className="absolute inset-0 z-[-1] h-full w-full scale-150 transform blur-2xl filter"
        style={css}
      />
      <FadeInImage src={img.src} alt="" />
      <div className="absolute bottom-0 z-0 hidden w-full border-0 border-b border-white/20 sm:block" />
      <div className="relative top-[176px] z-10 mx-auto h-[83px] max-w-2xl px-4">
        <div
          className="absolute inset-x-0 bottom-0 top-[21px] h-[83px] border-t border-white/10
            bg-grainy sm:top-[63px] sm:h-[41px] sm:rounded-t-xl sm:border-x lg:h-[141px]"
        />
      </div>
    </Transition>
  )
}
