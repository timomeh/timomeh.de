'use cache'

import { unstable_cacheTag as cacheTag } from 'next/cache'
import { getPost } from '@/data/posts'
import { RandomKicker } from '../../random-kicker'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  cacheTag('post', `post:${params.slug}`)
  const post = await getPost(params.slug)

  if (post?.frontmatter.kicker) {
    return <span>{post.frontmatter.kicker}</span>
  }

  return <RandomKicker />
}
