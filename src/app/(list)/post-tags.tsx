'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Tag } from '@/comps/tag'
import { BlogTag } from '@/lib/blog'

type Props = {
  tags: BlogTag[]
}

export function PostTags({ tags }: Props) {
  const params = useParams<{ tag?: string }>()

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={clsx(
          `ease-linear [transition:opacity_300ms,transform_60ms] hover:!opacity-100
          motion-safe:active:scale-[.97]`,
          !!params.tag && 'opacity-75',
        )}
      >
        <Tag
          color="rgb(156, 163, 175)"
          name="Everything"
          highlight={params.tag === undefined}
          clickable
        />
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/tag/${tag.slug}`}
          className={clsx(
            `ease-linear [transition:opacity_300ms,transform_60ms] hover:!opacity-100
            motion-safe:active:scale-[.97]`,
            params.tag !== tag.slug && 'opacity-75',
          )}
        >
          <Tag
            color={tag.color}
            name={tag.name}
            highlight={params.tag === tag.slug}
            clickable
          />
        </Link>
      ))}
    </div>
  )
}
