import { PostsListSidebar } from '../../posts-list-sidebar'

type Props = {
  params: Promise<{ year: string }>
}

export default async function Page({ params }: Props) {
  return <PostsListSidebar params={params} />
}

export async function generateStaticParams() {
  return []
}
