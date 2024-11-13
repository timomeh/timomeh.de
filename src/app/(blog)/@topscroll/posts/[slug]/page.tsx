import { PostPreview } from '@/comps/post-preview'
import { ScrollAway } from '@/comps/scroll-away'
import { getNewerPost } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getNewerPost(params.slug)
  if (!post) return null

  return (
    <div>
      <ScrollAway>
        <PostPreview slug={post.slug} direction="newer" />
      </ScrollAway>
    </div>
  )
}
