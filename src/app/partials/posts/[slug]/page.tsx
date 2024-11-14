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

export default async function Page(props: Props) {
  const h = await headers()
  if (h.get('x-api-key') !== config.api.internalSecret) {
    notFound()
  }

  const params = await props.params
  const post = await getPost(params.slug)
  if (!post) notFound()

  const contentWithoutH1 = post.content.replace(/^# .+\n?/, '')

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
