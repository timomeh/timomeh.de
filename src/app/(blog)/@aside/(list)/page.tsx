import { PostsListSidebar } from './posts-list-sidebar'

type Props = {
  params: Promise<{}>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: Props) {
  return <PostsListSidebar params={params} searchParams={searchParams} />
}
