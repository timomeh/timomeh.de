import { getPost } from '@/lib/blog'
import { ScrollAway } from './scroll-away'
import { PostPreview } from '@/comps/post-preview'

type Props = {
  slug: string
}

export async function NextPost({ slug }: Props) {
  const post = await getPost(slug)
  if (!post) return null

  return (
    <div className="[grid-area:topscroll]">
      <ScrollAway>
        <PostPreview slug={post.slug} dir="next" />
      </ScrollAway>
    </div>
  )
}
