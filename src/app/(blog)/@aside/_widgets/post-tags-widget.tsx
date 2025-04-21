import Link from 'next/link'

import { Tag } from '@/comps/tag'
import { getPost } from '@/data/posts'
import { getTag } from '@/data/tags'

type Props = {
  currentSlug: string
}

export async function PostTagsWidget({ currentSlug }: Props) {
  const post = await getPost(currentSlug)
  if (!post) return null

  const nullableTags = await Promise.all(post.tags.map((slug) => getTag(slug)))
  const tags = nullableTags.filter((tag) => tag !== null)

  return (
    <div>
      {tags.map((tag) => (
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
        className="group/btn inline-flex p-0.5 opacity-70 transition hover:opacity-100"
      >
        <Tag title="Browse tags…" />
      </Link>
    </div>
  )
}
