import type { Metadata } from 'next'
import Link from 'next/link'

import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'
import { Prose } from '@/comps/prose'
import { pluralizePosts } from '@/lib/plurals'

import { ListAllTags } from './data'

export default async function Page() {
  const tags = await ListAllTags.invoke()

  return (
    <>
      <PageNav>tags</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <Prose>
            <h1>Browse all tags</h1>
            <ul>
              {tags.map((tag) => (
                <li key={tag.slug}>
                  <Link href={`/tag/${tag.slug}`}>
                    {tag.title} - {pluralizePosts(tag.postCount)}
                  </Link>
                </li>
              ))}
            </ul>
          </Prose>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Tags',
  }

  return metadata
}
