'use cache'

import { unstable_cacheTag as cacheTag } from 'next/cache'
import { PostPreview } from '@/comps/post-preview'
import { getOlderPost } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  cacheTag('posts-list')

  const params = await props.params
  const post = await getOlderPost(params.slug)
  if (!post) return null

  return (
    <div>
      <PostPreview slug={post.slug} direction="older" />
    </div>
  )
}
