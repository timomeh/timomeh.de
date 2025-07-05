import { notFound } from 'next/navigation'

import { saneParseInt } from '@/lib/saneParseInt'

import { PostsList } from '../../../posts-list'
import { ReadMorePosts } from '../../../read-more-posts'

type Props = {
  params: Promise<{ year: string }>
}

export default async function Page({ params }: Props) {
  const year = saneParseInt((await params).year) || notFound()
  return (
    <>
      <PostsList year={year} sort="asc" />
      <ReadMorePosts year={year - 1} />
    </>
  )
}

export async function generateStaticParams() {
  return []
}
