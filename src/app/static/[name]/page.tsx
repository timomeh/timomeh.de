import { notFound } from 'next/navigation'

import { MDXRenderer } from '@/components/MDXRenderer'
import { Prose } from '@/components/Prose'
import { getSite } from './getSite'

type Props = {
  params: {
    name: string
  }
}

export default async function StaticPage({ params }: Props) {
  const site = await getSite(params.name)
  if (!site) notFound()

  return (
    <main className="meh-main">
      <div className="mx-4">
        <Prose>
          <MDXRenderer content={site.body} scope={params.name} />
        </Prose>
      </div>
    </main>
  )
}
