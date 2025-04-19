import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { GlassPill } from '@/comps/glass-pill'
import { pagePublishedPosts } from '@/data/posts'
import { saneParseInt } from '@/lib/saneParseInt'

import { ListedPost } from '../../listed-post'
import { parseSort } from '../../parse-sort'

export const fetchCache = 'force-cache'

type Props = {
  params: Promise<{ year: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ params, searchParams }: Props) {
  const sort = parseSort((await searchParams).sort)
  const year = saneParseInt((await params).year) || notFound()
  if (year > new Date().getFullYear()) notFound()
  if (year === new Date().getFullYear()) redirect('/')

  const posts = await pagePublishedPosts(year, { sort })
  if (posts.length < 1) notFound()

  return (
    <div className="space-y-10">
      <div className="mb-4 flex justify-center">
        <GlassPill>
          <h3>{groupTitle(year, posts.length)}</h3>
        </GlassPill>
      </div>
      {posts.map((post) => (
        <ListedPost key={post.slug} slug={post.slug} />
      ))}
    </div>
  )
}

function groupTitle(year: number, amount: number) {
  const posts = amount > 1 ? 'posts' : 'post'
  return `${amount} ${posts} in ${year}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const year = saneParseInt((await params).year)

  return {
    title: String(year),
    description: `About blog about software development, music, my life, and other random thoughts I wanted to elaborate on.`,
  }
}
