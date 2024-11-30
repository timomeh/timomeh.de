import { ComponentProps } from 'react'

import { unstable_cacheTag as cacheTag } from 'next/cache'
import { Tag } from './tag'
import { getTag } from '@/data/tags'

type Props = {
  slug: string
} & Partial<ComponentProps<typeof Tag>>

export async function PostTag({ slug, ...rest }: Props) {
  'use cache'
  const tag = await getTag(slug)
  if (!tag) return null

  cacheTag('tag', `tag:${tag.slug}`)

  return <Tag {...rest} color={tag.color || 'white'} title={tag.title} />
}
