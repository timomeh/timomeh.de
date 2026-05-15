import type { Metadata } from 'next'

import { SearchControls } from '@/app/(blog)/search/search-controls'
import { PageFooter } from '@/comps/layout/page-footer'
import { PageMain } from '@/comps/layout/page-main'
import { PageNav } from '@/comps/layout/page-nav'

import { SearchInput } from './search-input'
import { SearchResults } from './search-results'

type Props = {
  searchParams: Promise<{ query?: string }>
}

export default async function Page({ searchParams }: Props) {
  const { query } = await searchParams

  return (
    <>
      <PageNav>search page</PageNav>
      <PageMain>
        <div className="mx-auto max-w-2xl p-4 !py-12 sm:p-6 md:p-8">
          <SearchControls>
            <SearchInput defaultValue={query ?? ''} />
            <div className="h-4" />
            <SearchResults query={query ?? ''} />
          </SearchControls>
        </div>
      </PageMain>
      <PageFooter />
    </>
  )
}

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Search',
  }

  return metadata
}
