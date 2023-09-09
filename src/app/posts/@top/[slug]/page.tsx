import { notFound } from 'next/navigation'
import { getPost } from '@/lib/blog'
import { FulltopCover } from '@/components/FulltopCover'

type Props = {
  params: {
    slug: string
  }
}

export default async function TopPost({ params }: Props) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  if (!post.meta.cover_image) return null

  // @ts-expect-error Server Component
  return <FulltopCover image={post.meta.cover_image} />
}
