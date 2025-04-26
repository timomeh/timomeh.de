import { Metadata } from 'next'
import Link from 'next/link'

import { Prose } from '@/comps/prose'
import { listTags } from '@/data/tags'
import { pluralizePosts } from '@/lib/plurals'

export default async function Page() {
  const tags = await listTags()

  return (
    <div className="relative">
      <div className="p-4 sm:p-6 md:p-8">
        <>
          <Prose>
            <h1>Browse all tags</h1>
            <ul>
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <Link href={`/tag/${tag.slug}`}>
                    {tag.title} ({pluralizePosts(tag.postCount)})
                  </Link>
                </li>
              ))}
            </ul>
          </Prose>
        </>
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
