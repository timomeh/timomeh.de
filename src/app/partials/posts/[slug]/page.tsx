import { MDX } from '@/comps/mdx/mdx'
import { config } from '@/config'
import { contentAsset } from '@/data/cms'
import { getPost } from '@/data/posts'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: Promise<{ slug: string }>
}

// Renders a simple HTML version of a blogpost. Used for HTML in feeds.
// Cause rendering MDX in a route handler is apparently a pain.

export default async function Page(props: Props) {
  const h = await headers()
  if (h.get('x-api-key') !== config.api.internalSecret) {
    notFound()
  }

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
