import { notFound } from 'next/navigation'

import { saneParseInt } from '@/lib/saneParseInt'

import { PostsList } from '../../../posts-list'

type Props = {
  params: Promise<{ year: string }>
}

export default async function Page({ params }: Props) {
  const year = saneParseInt((await params).year) || notFound()
  return <PostsList year={year} sort="asc" />
}

export async function generateStaticParams() {
  return []
}
