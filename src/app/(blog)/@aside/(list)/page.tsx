import { PostsListSidebar } from './posts-list-sidebar'

type Props = {
  params: Promise<{}>
}

export default async function Page({ params }: Props) {
  return <PostsListSidebar params={params} />
}
