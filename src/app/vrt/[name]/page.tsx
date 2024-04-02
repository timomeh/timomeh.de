import { promises as fs } from 'node:fs'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { MDX } from '@/comps/mdx/mdx'

export const dynamic = 'force-static'
export const dynamicParams = true
export function generateStaticParams() {
  return []
}

type Props = {
  params: { name: string }
}

export default async function Page({ params }: Props) {
  if (params.name === 'shiki') {
    return <ShikiTest />
  }

  if (params.name === 'markdown') {
    return <MarkdownTest />
  }

  notFound()
}

function ShikiTest() {
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <MDX
        content={`
\`\`\`ts
function hello(params: unknown) {
  return 'world'
}

export const foo = {
  bar: 'baz',
  quox: ['a', 1, {}],
}
\`\`\`

\`\`\`ts
console.log('hewwo') // [!code --]
console.log('hello') // [!code ++]
console.log('goodbye')
\`\`\`

\`\`\`ts
console.log('Not highlighted')
console.log('Highlighted') // [!code highlight]
console.log('Not highlighted')
\`\`\`

\`\`\`ts
// [!code word:Hello]
const message = 'Hello World'
console.log(message) // prints Hello World
\`\`\`

\`\`\`ts
console.log('Not focused');
console.log('Focused') // [!code focus]
console.log('Not focused');
\`\`\`

\`\`\`ts
console.log('No errors or warnings')
console.error('Error') // [!code error]
console.warn('Warning') // [!code warning]
\`\`\`
`}
      />
    </div>
  )
}

async function MarkdownTest() {
  const file = await fs.readFile(
    process.cwd() + '/src/app/vrt/[name]/markdown-test.md',
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
