import { PostPreview } from '@/app/_comps/post-preview'
import { getPostBySlug } from '@/app/_data/post.dto'

type Props = {
  slug: string
}

export async function PrevPost({ slug }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) return null

  return (
    <div className="paginate-prev">
      <PostPreview slug={post.slug} dir="prev" />
    </div>
  )
}
