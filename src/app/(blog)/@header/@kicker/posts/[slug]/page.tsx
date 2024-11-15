import { getPost } from '@/data/posts'
import { RandomKicker } from '../../random-kicker'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)

  if (post?.frontmatter.kicker) {
    return <span>{post.frontmatter.kicker}</span>
  }

  return <RandomKicker />
}
