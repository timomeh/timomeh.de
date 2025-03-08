import { notFound } from 'next/navigation'
import { NextResponse } from 'next/server'

import { cms } from '@/data/cms'
import { getPage } from '@/data/pages'
import { getPost } from '@/data/posts'
import { getTag } from '@/data/tags'

// public proxy for files in the private github repo

export async function GET(
  _req: Request,
  props: {
    params: Promise<{ collection: string; slug: string; file: string[] }>
  },
) {
  const params = await props.params
  let path: string | null = null

  // ensure file is allowed to be fetched

  if (params.collection === 'posts') {
    const post = await getPost(params.slug)
    if (!post) notFound()
    path = `posts/${params.slug}`
  }

  if (params.collection === 'pages') {
    const page = await getPage(params.slug)
    if (!page) notFound()
    path = `pages/${params.slug}`
  }

  if (params.collection === 'tags') {
    const tag = await getTag(params.slug)
    if (!tag) notFound()
    path = `tags/${params.slug}`
  }

  if (!path) notFound()

  // don't allow to fetch index files
  if (params.file.at(-1)?.startsWith('index.')) notFound()

  // try to fetch the file
  const res = await cms.assets.get(`${path}/${params.file.join('/')}`)

  if (!res.ok) {
    if (res.status === 404) notFound()
    return new Response('Failed to fetch image', { status: res.status })
  }

  // proxy the file

  const headers = new Headers()
  headers.set('Content-Type', res.headers.get('content-type')!)
  headers.set('Cache-Control', 'public, max-age=15768000')
  headers.set('Content-Disposition', `inline; filename="${params.file.at(-1)}"`)

  return new NextResponse(res.body, { headers })
}
