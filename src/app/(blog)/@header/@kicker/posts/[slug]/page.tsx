import { getPost } from '@/data/posts'
import { DataKicker } from '../../data-kicker'

type Props = {
  params: Promise<{ slug: string }>
}

export default function Page(props: Props) {
  return (
    <DataKicker
      fetcher={async () => {
        const params = await props.params
        const post = await getPost(params.slug)
        return post?.frontmatter.kicker
      }}
    />
  )
}
