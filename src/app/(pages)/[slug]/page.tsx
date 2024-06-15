import { notFound } from 'next/navigation'

import { BackTag } from '@/comps/back-tag'
import { MDX } from '@/comps/mdx/mdx'

import { getSite } from './getSite'

export const dynamic = 'force-static'
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: {
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const site = await getSite(params.slug)
  if (!site) notFound()

  return (
    <main className="relative z-30 w-full flex-1">
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="mb-10 flex sm:pt-6">
          <BackTag />
        </div>

        <article className="prose prose-invert relative animate-fade-in">
          <MDX content={site.body} />
        </article>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const site = await getSite(params.slug)
  if (!site) return {}

  return { ...site.head }
}
