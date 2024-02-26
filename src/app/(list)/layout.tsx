import { listTags } from '@/lib/blog'

import { PostTags } from './post-tags'

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  const tags = await listTags()

  return (
    <>
      <nav className="mx-auto max-w-2xl px-4 sm:mt-6">
        <PostTags tags={tags} />
      </nav>
      {children}
    </>
  )
}
