import { PostPreview } from '@/app/_comps/post-preview'
import { getPrevPostBySlug } from '@/app/_data/post.dto'

type Props = {
  forSlug: string
}

export async function PrevPost({ forSlug }: Props) {
  const post = await getPrevPostBySlug(forSlug)
  if (!post) return null

  return (
    <div className="paginate-prev">
      <PostPreview slug={post.slug} dir="prev" />
    </div>
  )
}
