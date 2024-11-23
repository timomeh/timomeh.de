import { MDX } from '@/comps/mdx/mdx'
import { config } from '@/config'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ slug: string }>
}

// Renders a simple HTML version of a blogpost. Used for HTML in feeds.
// Cause rendering MDX in a route handler is apparently a pain.

export default async function Page(props: Props) {
  return (
    <Suspense>
      <Access>
        <CachedPost {...props} />
      </Access>
    </Suspense>
  )
}

async function CachedPost(props: Props) {
  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  // strip h1 but only if it isn't a link
  const contentWithoutH1 = post.content.replace(
    /^# (?!.*\[[^\]]+\]\([^)]+\)).+\n?/,
    '',
  )

  return (
    <article id="partial">
      <MDX
        plain
        content={contentWithoutH1}
        assetPrefix={contentAsset('posts', post.slug, '')}
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
