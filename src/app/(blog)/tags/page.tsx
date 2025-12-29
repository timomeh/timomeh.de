import type { Metadata } from 'next'
import Link from 'next/link'

import { Prose } from '@/comps/prose'
import { ListAllTags } from '@/data/actions/listAllTags'

export default async function Page() {
  const tags = await ListAllTags.invoke()

  return (
    <div className="relative">
      <div className="p-4 sm:p-6 md:p-8">
        <Prose>
          <h1>Browse all tags</h1>
          <ul>
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link href={`/tag/${tag.slug}`}>{tag.titleAndCount}</Link>
              </li>
            ))}
          </ul>
        </Prose>
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
