import { PostPreview } from '@/app/_comps/post-preview'
import { getRelatedPosts } from '@/app/_lib/blog'

import { ScrollAway } from './scroll-away'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const { next } = await getRelatedPosts(params.slug)
  if (!next) return null

  return (
    <ScrollAway>
      <PostPreview slug={next} dir="next" />
    </ScrollAway>
  )
}
