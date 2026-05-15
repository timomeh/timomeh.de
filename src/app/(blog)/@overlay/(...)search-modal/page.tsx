import { SearchControls } from '@/app/(blog)/search/search-controls'

import { SearchInput } from '../../search/search-input'
import { SearchResults } from '../../search/search-results'

type Props = {
  searchParams: Promise<{ query?: string }>
}

export default async function SearchOverlay({ searchParams }: Props) {
  const { query } = await searchParams

  return (
    <SearchControls>
      <div className="p-4 pb-0">
        <SearchInput defaultValue={query ?? ''} />
      </div>
      <div className="min-h-0 overflow-y-auto px-4">
        <SearchResults query={query ?? ''} />
      </div>
    </SearchControls>
  )
}
