import { notFound } from 'next/navigation'

import { listTags } from '@/lib/blog'

import PostList from '../../post-list'

type Props = {
  params: {
    tag: string
  }
}

export default async function Page({ params }: Props) {
  const tags = await listTags()
  const tag = tags.find((t) => t.slug === params.tag)
  if (!tag) notFound()

  return (
    <main className="mx-auto max-w-2xl px-4">
      <PostList tag={params.tag} />
    </main>
  )
}
