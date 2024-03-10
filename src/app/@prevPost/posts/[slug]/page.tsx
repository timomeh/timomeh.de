import { PostPreview } from '@/comps/post-preview'
import { getRelatedPosts } from '@/lib/blog'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const { prev } = await getRelatedPosts(params.slug)
  if (!prev) return null

  return <PostPreview slug={prev} dir="prev" />
}
