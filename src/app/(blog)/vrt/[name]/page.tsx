import { promises as fs } from 'node:fs'
import path from 'node:path'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'

export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: Promise<{ name: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  if (params.name === 'shiki') {
    return <ShikiTest />
  }

  if (params.name === 'markdown') {
    return <MarkdownTest />
  }

  notFound()
}

async function ShikiTest() {
  const file = await fs.readFile(
    path.join(process.cwd(), '/src/app/vrt/[name]/shiki-test.mdx'),
    'utf8',
  )

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <MDX content={file} />
    </div>
  )
}

async function MarkdownTest() {
  const file = await fs.readFile(
    path.join(process.cwd(), '/src/app/vrt/[name]/markdown-test.mdx'),
    'utf8',
  )

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <div className="prose prose-invert">
        <MDX content={file} />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}
