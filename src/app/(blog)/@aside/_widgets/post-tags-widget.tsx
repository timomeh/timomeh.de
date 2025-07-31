import Link from 'next/link'

import { Tag } from '@/comps/tag'
import { getPostBySlug } from '@/data/posts'

type Props = {
  currentSlug: string
}

export async function PostTagsWidget({ currentSlug }: Props) {
  const post = await getPostBySlug(currentSlug)
  if (!post) return null

  return (
    <div>
      {post.postTags.map(({ tag }) => (
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
