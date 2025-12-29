import Link from 'next/link'

import { Tag } from '@/comps/tag'
import { ListPostTags } from '@/data/actions/listPostTags'

type Props = {
  currentSlug: string
}

export async function PostTagsWidget({ currentSlug }: Props) {
  const postTags = await ListPostTags.invoke(currentSlug)
  if (!postTags) return null

  return (
    <div>
      {postTags.map(({ tag }) => (
        <Link
          key={tag.slug}
          href={`/tag/${tag.slug}`}
          className="group/btn inline-flex p-0.5"
        >
          <Tag title={tag.title} />
        </Link>
      ))}
      <Link
        href="/tags"
        className="group/btn inline-flex p-0.5 opacity-70 transition
          hover:opacity-100"
      >
        <Tag title="Browse tags…" />
      </Link>
    </div>
  )
}
