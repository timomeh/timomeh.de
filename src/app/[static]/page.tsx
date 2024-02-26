import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'
import { Tag } from '@/comps/tag'

import { getSite } from './getSite'

type Props = {
  params: {
    static: string
  }
}

export default async function StaticPage({ params }: Props) {
  const site = await getSite(params.static)
  if (!site) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-10 flex sm:pt-6">
        <Link href="/">
          <Tag color="#DEC1EF" clickable name="← Back" />
        </Link>
      </div>

      <article className="prose prose-invert relative">
        <MDX content={site.body} />
      </article>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const site = await getSite(params.static)
  if (!site) return {}

  return { ...site.head }
}
