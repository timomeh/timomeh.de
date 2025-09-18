import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { MDX } from '@/comps/mdx/mdx'
import { config } from '@/config'
import { contentAsset } from '@/data/cms'
import { getShortById } from '@/data/shorts'

type Props = {
  params: Promise<{ slug: string }>
}

// Renders a simple HTML version of a short.
// Used for the HTML in feeds. The feeds fetch this page and parse the content.
// Why does this exist? Because rendering a RSC's in a route handler is insane.

export default async function Page(props: Props) {
  return (
    <Suspense>
      <Access>
        <SimpleShort {...props} />
      </Access>
    </Suspense>
  )
}

export async function generateStaticParams() {
  return []
}

async function SimpleShort(props: Props) {
  const params = await props.params
  const short = await getShortById(params.slug)
  if (!short) notFound()

  // The content gets wrapped by <marker-start /> and <marker-end />, allowing
  // for easy parsing.

  return (
    <article id="partial">
      <MDX
        plain
        cacheKey={`simple-short-${short.id}`}
        cacheTags={['mdx-type:simple-short', `mdx-short:${short.id}`]}
        content={[
          '<FeedParseMarker name="begin" />',
          short.content,
          '<FeedParseMarker name="end" />',
        ].join('\n')}
        assetPrefix={
          new URL(contentAsset('shorts', short.id, ''), config.siteUrl).href
        }
        components={{
          FeedParseMarker: (props: { name: string }) => {
            const Element = `marker-${props.name}`
            return <Element />
          },
        }}
      />
    </article>
  )
}

async function Access(props: { children: React.ReactNode }) {
  const h = await headers()
  if (
    process.env.NODE_ENV === 'production' &&
    h.get('x-api-key') !== config.api.internalSecret
  ) {
    notFound()
  }

  return <>{props.children}</>
}
