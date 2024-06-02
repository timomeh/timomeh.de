import { PostPreview } from '@/app/_comps/post-preview'
import { getPostBySlug } from '@/app/_data/post.dto'
import { ScrollAway } from './scroll-away'

type Props = {
  slug: string
}

export async function NextPost({ slug }: Props) {
  const post = await getPostBySlug(slug)
  if (!post) return null

  return (
    <div className="paginate-next">
      <ScrollAway>
        <PostPreview slug={post.slug} dir="next" />
      </ScrollAway>
    </div>
  )
}
