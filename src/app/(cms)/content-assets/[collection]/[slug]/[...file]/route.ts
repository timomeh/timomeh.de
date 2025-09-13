import fsSync from 'node:fs'
import fsAsync from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'

import { notFound } from 'next/navigation'
import { after, NextResponse } from 'next/server'

import { cms } from '@/data/cms'
import { getPageBySlug } from '@/data/pages'
import { getPostBySlug } from '@/data/posts'
import { getTagBySlug } from '@/data/tags'
import { log as baseLog } from '@/lib/log'

const log = baseLog.child().withContext({ module: 'imageproxy' })

// public cached proxy for files in the private github repo.
// Deprecated in favor of imgproxy.
// Just here for backwards compatibility to not break URLs. Too lazy to do a redirect lol.

const baseCacheDir = path.join(process.cwd(), '.next/cache/raw-content-images')

export async function GET(
  _req: Request,
  props: {
    params: Promise<{ collection: string; slug: string; file: string[] }>
  },
) {
  const params = await props.params
  const filename = [params.collection, params.slug, params.file.join('-')].join(
    '-',
  )

  const cachedPath = path.join(baseCacheDir, filename)

  if (await fileExists(cachedPath)) {
    const ext = path.extname(cachedPath)
    const mimeTypes: Record<string, string> = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
    }
    const stream = fsSync.createReadStream(cachedPath)
    const headers = new Headers()
    headers.set('Content-Type', mimeTypes[ext] || 'application/octet-stream')
    headers.set('Cache-Control', 'public, max-age=15768000')
    headers.set(
      'Content-Disposition',
      `inline; filename="${params.file.at(-1)}"`,
    )
    return new NextResponse(stream as unknown as BodyInit, {
      headers,
    })
  }

  // not cached!
  // ensure file is allowed to be fetched

  let assetFolder: string | null = null
  if (params.collection === 'posts') {
    const post = await getPostBySlug(params.slug)
    if (!post) notFound()
    assetFolder = `posts/${params.slug}`
  }

  if (params.collection === 'pages') {
    const page = await getPageBySlug(params.slug)
    if (!page) notFound()
    assetFolder = `pages/${params.slug}`
  }

  if (params.collection === 'tags') {
    const tag = await getTagBySlug(params.slug)
    if (!tag) notFound()
    assetFolder = `tags/${params.slug}`
  }

  if (!assetFolder) notFound()

  // don't allow to fetch index files
  if (params.file.at(-1)?.startsWith('index.')) notFound()

  const assetFilepath = `${assetFolder}/${params.file.join('/')}`

  log.withMetadata({ assetFilepath }).info(`Loading image ${assetFilepath}...`)

  // try to fetch the file
  const res = await cms.assets.get(assetFilepath)

  if (!res.ok || !res.body) {
    if (res.status === 404) notFound()
    log
      .withMetadata({ assetFilepath })
      .info(`Could not find ${assetFilepath}...`)
    return new Response('Failed to fetch image', { status: res.status })
  }

  const [forClient, forDisk] = res.body.tee()

  after(async () => {
    log
      .withMetadata({ assetFilepath })
      .info(`Saving image on disk: ${assetFilepath}...`)

    await fsAsync.mkdir(baseCacheDir, { recursive: true })
    const writeStream = fsSync.createWriteStream(cachedPath)
    // biome-ignore lint/suspicious/noExplicitAny: it's ok
    Readable.fromWeb(forDisk as unknown as any).pipe(writeStream)
  })

  // proxy the file

  const headers = new Headers()
  headers.set('Cache-Control', 'public, max-age=15768000')
  headers.set('Content-Disposition', `inline; filename="${params.file.at(-1)}"`)

  const contentType = res.headers.get('content-type')
  if (contentType) headers.set('Content-Type', contentType)

  return new NextResponse(forClient, { headers })
}

async function fileExists(filePath: string) {
  try {
    await fsAsync.access(filePath)
    return true
  } catch {
    return false
  }
}
