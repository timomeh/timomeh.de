import { PostsList } from '../../../posts-list'

type Props = {
  params: Promise<{ tag: string }>
}

export default async function Page({ params }: Props) {
  const tagSlug = (await params).tag
  return <PostsList tagSlug={tagSlug} sort="asc" />
}

export async function generateStaticParams() {
  return []
}
