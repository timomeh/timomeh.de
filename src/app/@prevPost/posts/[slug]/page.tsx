import { PostPreview } from '@/comps/post-preview'
import { ScrollFade } from '@/comps/scroll-fade'
import { getRelatedPosts } from '@/util/related-posts'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const { prev } = await getRelatedPosts(params.slug)
  if (!prev) return null

  return (
    <ScrollFade pos="bottom">
      <PostPreview slug={prev} dir="prev" />
    </ScrollFade>
  )
}
