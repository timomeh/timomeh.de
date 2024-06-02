import { notFound } from 'next/navigation'

import { BackTag } from '@/app/_comps/back-tag'
import { MDX } from '@/app/_comps/mdx/mdx'
import { getPageBySlug } from '@/app/_data/page.dto'

export const dynamic = 'force-static'
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: { slug: string }
}

export default async function Page({ params }: Props) {
  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  return (
    <main className="relative z-30 w-full flex-1">
      <div className="relative mx-auto max-w-2xl px-4">
        <div className="mb-10 flex sm:pt-6">
          <BackTag />
        </div>

        <article className="prose prose-invert relative animate-fade-in">
          <MDX content={page.body} />
        </article>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: Props) {
  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  return {
    title: page.meta.title || page.title,
    description: page.meta.description || page.excerpt,
    openGraph: {
      description: page.meta.description || page.excerpt,
      authors: ['Timo Mämecke'],
      locale: page.lang || 'en',
      images: page.meta.ogImage ? [page.meta.ogImage] : undefined,
    },
  }
}
