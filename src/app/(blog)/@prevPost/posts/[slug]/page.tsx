import { PostPreview } from '@/app/_comps/post-preview'
import { getRelatedPosts } from '@/app/_lib/blog'

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const { prev } = await getRelatedPosts(params.slug)
  if (!prev) return null

  return <PostPreview slug={prev} dir="prev" />
}
