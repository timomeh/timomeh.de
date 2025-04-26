import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { MDX } from '@/comps/mdx/mdx'
import { config } from '@/config'
import { contentAsset } from '@/data/cms'
import { getPostBySlug } from '@/data/posts'

type Props = {
  params: Promise<{ slug: string }>
}

// Renders a simple HTML version of a blogpost.
// Used for the HTML in feeds. The feeds fetch this page and parse the content.
// Why does this exist? Because rendering a RSC's in a route handler is insane.

export default async function Page(props: Props) {
  return (
    <Suspense>
      <Access>
        <SimplePost {...props} />
      </Access>
    </Suspense>
  )
}

export async function generateStaticParams() {
  return []
}

async function SimplePost(props: Props) {
  const params = await props.params
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  // strip h1 but only if it isn't a link
  const contentWithoutH1 = post.content.replace(
    /^# (?!.*\[[^\]]+\]\([^)]+\)).+\n?/,
    '',
  )

  // The content gets wrapped by <marker-start /> and <marker-end />, allowing
  // for easy parsing.

  return (
    <article id="partial">
      <MDX
        plain
        cacheKey={`simple-post-${post.slug}`}
        cacheTags={['mdx-type:simple-post', `mdx-post:${post.slug}`]}
        content={[
          '<FeedParseMarker name="begin" />',
          contentWithoutH1,
          '<FeedParseMarker name="end" />',
        ].join('\n')}
        assetPrefix={
          new URL(contentAsset('posts', post.slug, ''), config.siteUrl).href
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

export async function SuperSimplePost(props: { slug: string }) {
  const post = await getPostBySlug(props.slug)
  if (!post) notFound()

  // strip h1 but only if it isn't a link
  const contentWithoutH1 = post.content.replace(
    /^# (?!.*\[[^\]]+\]\([^)]+\)).+\n?/,
    '',
  )

  return (
    <MDX
      plain
      content={contentWithoutH1}
      assetPrefix={
        new URL(contentAsset('posts', post.slug, ''), config.siteUrl).href
      }
    />
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
