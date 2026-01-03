import Link from 'next/link'

import { Tag } from '@/comps/tag'
import { ListSidebarTags } from '../data'

type Props = {
  sort?: 'asc' | 'desc' | null
  tagParam?: string
}

export async function TagsWidget({ sort, tagParam }: Props) {
  const activeTag = tagParam
  const tags = await ListSidebarTags.invoke()

  return (
    <div>
      {tags.slice(0, 14).map((tag) => (
        <Link
          key={tag.slug}
          href={`/tag/${tag.slug}${sort === 'asc' ? '/asc' : ''}`}
          className="group/btn inline-flex p-0.5"
        >
          <Tag title={tag.title} active={tag.slug === activeTag} />
        </Link>
      ))}
      <Link
        href="/tags"
        className="group/btn inline-flex p-0.5 opacity-70 transition
          hover:opacity-100"
      >
        <Tag title="All tags…" />
      </Link>
    </div>
  )
}
