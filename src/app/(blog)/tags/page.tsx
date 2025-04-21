import { Metadata } from 'next'
import Link from 'next/link'
import { unstable_ViewTransition as ViewTransition } from 'react'

import { Prose } from '@/comps/prose'
import { listTags } from '@/data/tags'

export const fetchCache = 'force-cache'

export default async function Page() {
  const tags = await listTags()

  return (
    <div className="relative">
      <div className="p-4 sm:p-6 md:p-8">
        <ViewTransition>
          <Prose>
            <h1>Browse all tags</h1>
            <ul>
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <Link href={`/tag/${tag.slug}`}>{tag.title}</Link>
                </li>
              ))}
            </ul>
          </Prose>
        </ViewTransition>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Tags',
  }

  return metadata
}
