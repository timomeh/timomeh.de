import Link from 'next/link'

import { Tag } from '@/comps/tag'
import { listTags } from '@/data/tags'

type Props = {
  sortParam?: string | string[]
  tagParam?: string
}

export async function TagsWidget({ sortParam, tagParam }: Props) {
  const tags = await listTags()
  const activeSort = sortParam?.toString() === 'asc' ? 'asc' : null
  const activeTag = tagParam

  return (
    <div>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={{
            pathname: `/tag/${tag.slug}`,
            query: activeSort ? { sort: activeSort } : {},
          }}
          className="group/btn inline-flex p-0.5"
        >
          <Tag title={tag.title} active={tag.slug === activeTag} />
        </Link>
      ))}
      <Link
        href="/tags"
        className="group/btn inline-flex p-0.5 opacity-70 transition hover:opacity-100"
      >
        <Tag title="Browse tags…" />
      </Link>
    </div>
  )
}
