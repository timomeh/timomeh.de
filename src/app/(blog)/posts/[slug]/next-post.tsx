import { getNextPostBySlug } from '@/app/_data/post.dto'
import { PostPreview } from '@/app/_comps/post-preview'
import { ScrollAway } from './scroll-away'

type Props = {
  forSlug: string
}

export async function NextPost({ forSlug }: Props) {
  const post = await getNextPostBySlug(forSlug)
  if (!post) return null

  return (
    <div className="paginate-next">
      <ScrollAway>
        <PostPreview slug={post.slug} dir="next" />
      </ScrollAway>
    </div>
  )
}
