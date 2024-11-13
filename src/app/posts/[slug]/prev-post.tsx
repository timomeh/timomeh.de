import { PostPreview } from '@/comps/post-preview'
import { getPost } from '@/lib/blog'

type Props = {
  slug: string
}

export async function PrevPost({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <div className="[grid-area:bottomscroll]">
      <PostPreview slug={post.slug} dir="prev" />
    </div>
  )
}
