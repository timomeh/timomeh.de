import React from 'react'

import { getTag } from '@/data/tags'

import { Tag } from './tag'

type Props = {
  slug: string
} & Partial<React.ComponentProps<typeof Tag>>

export async function PostTag({ slug, ...rest }: Props) {
  const tag = await getTag(slug)
  if (!tag) return null

  return <Tag {...rest} color={tag.color || 'white'} title={tag.title} />
}
